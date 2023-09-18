/* eslint-disable import-helpers/order-imports */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet.frameguard({ action: 'deny' }));

const port = process.env.PORT || 5000;
const isClubsEnabled =
  process.env.REACT_APP_FEATURE_CLUBS?.toLowerCase() === 'true';
const isTournamentsEnabled =
  process.env.REACT_APP_FEATURE_TOURNAMENTS?.toLowerCase() === 'true';
const isAchievementsEnabled =
  process.env.REACT_APP_FEATURE_ACHIEVEMENTS?.toLowerCase() === 'true';

const isFantasyEnabled =
  process.env.REACT_APP_FEATURE_FANTASY?.toLowerCase() === 'true';

const fs = require('fs');
const path = require('path');

const { getMarket } = require('./api/market');
const { getLeaderboardGroupBySlug } = require('./api/group_leaderboards');
const { getTournamentBySlug } = require('./api/tournaments');
const {
  formatMarketMetadata,
  replaceToMetadataTemplate
} = require('./helpers/string');

const indexPath = path.resolve(__dirname, '..', 'build', 'index.html');

// fetching available metadata from env variables
const defaultMetadata = {
  title:
    process.env.REACT_APP_METADATA_TITLE ||
    'Polkamarkets - Autonomous Prediction Markets',
  description:
    process.env.REACT_APP_METADATA_DESCRIPTION ||
    'Polkamarkets is a DeFi-Powered Prediction Market built for cross-chain information exchange.',
  image: process.env.REACT_APP_METADATA_IMAGE || '/metadata-homepage.png'
};

const metadataByPage = {
  achievements: {
    title:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_TITLE ||
      'Achievements - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_DESCRIPTION ||
      'Place predictions in the Polkamarkets app and grab your exclusive NFT Achievements.',
    image:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_IMAGE ||
      '/metadata-homepage.png'
  },
  clubs: {
    title: process.env.REACT_APP_METADATA_CLUBS_TITLE || 'Clubs - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_CLUBS_DESCRIPTION ||
      "Build your own Club, league and leaderboard with your friends, against colleagues or around communities. Wear your own logo, tease your clubmates and let all fight to climb the Club's leaderboard.",
    image:
      process.env.REACT_APP_METADATA_CLUBS_IMAGE || '/metadata-homepage.png'
  },
  tournaments: {
    title:
      process.env.REACT_APP_METADATA_TOURNAMENTS_TITLE ||
      'Tournaments - Polkamarkets',
    description: process.env.REACT_APP_METADATA_TOURNAMENTS_DESCRIPTION || '',
    image:
      process.env.REACT_APP_METADATA_TOURNAMENTS_IMAGE ||
      '/metadata-homepage.png'
  },
  leaderboard: {
    title:
      process.env.REACT_APP_METADATA_LEADERBOARD_TITLE ||
      'Leaderboard - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_LEADERBOARD_DESCRIPTION ||
      'Rank up higher on the leaderboard and be the #1 forecaster of Polkamarkets.',
    image:
      process.env.REACT_APP_METADATA_LEADERBOARD_IMAGE ||
      '/metadata-leaderboard.png'
  },
  portfolio: {
    title:
      process.env.REACT_APP_METADATA_PORTFOLIO_TITLE ||
      'Portfolio - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_PORTFOLIO_DESCRIPTION ||
      'Participate in the Polkamarkets app and compete with your friends, coworkers or other community members.',
    image:
      process.env.REACT_APP_METADATA_PORTFOLIO_IMAGE ||
      '/metadata-portfolio.png'
  }
};

const defaultMetadataTemplate = (request, htmlData) => {
  return replaceToMetadataTemplate({
    htmlData,
    url: `${request.headers['x-forwarded-proto'] || 'http'}://${
      request.headers.host
    }${request.url}`,
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    image: defaultMetadata.image.startsWith('http')
      ? defaultMetadata.image
      : `${request.headers['x-forwarded-proto'] || 'http'}://${
          request.headers.host
        }${defaultMetadata.image}`
  });
};

const metadataByPageTemplate = (page, request, htmlData) => {
  const metadata = metadataByPage[page];

  return replaceToMetadataTemplate({
    htmlData,
    url: `${request.headers['x-forwarded-proto'] || 'http'}://${
      request.headers.host
    }${request.url}`,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image.startsWith('http')
      ? metadata.image
      : `${request.headers['x-forwarded-proto'] || 'http'}://${
          request.headers.host
        }${metadata.image}`
  });
};

app.get('/', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(defaultMetadataTemplate(request, htmlData));
  });
});

app.get('/blocked', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(defaultMetadataTemplate(request, htmlData));
  });
});

app.get('/reset', (request, response) => {
  if (!isFantasyEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(defaultMetadataTemplate(request, htmlData));
  });
});

app.get('/portfolio', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }
    return response.send(
      metadataByPageTemplate('portfolio', request, htmlData)
    );
  });
});

app.get('/achievements', (request, response) => {
  if (!isAchievementsEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(
      metadataByPageTemplate('achievements', request, htmlData)
    );
  });
});

app.get('/clubs', (request, response, next) => {
  if (!isClubsEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }
    return response.send(metadataByPageTemplate('clubs', request, htmlData));
  });
});

app.get('/clubs/:slug', async (request, response, next) => {
  if (!isClubsEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    const groupSlug = request.params.slug;

    try {
      const leaderboardGroup = await getLeaderboardGroupBySlug(groupSlug);
      const { title, bannerUrl } = leaderboardGroup.data;

      return response.send(
        replaceToMetadataTemplate({
          htmlData,
          url: `${request.headers['x-forwarded-proto'] || 'http'}://${
            request.headers.host
          }/clubs/${request.params.slug}`,
          title: `${title} - ${defaultMetadata.title}`,
          description:
            metadataByPage.clubs.description || defaultMetadata.description,
          image:
            bannerUrl ||
            `${request.headers['x-forwarded-proto'] || 'http'}://${
              request.headers.host
            }${defaultMetadata.image}`
        })
      );
    } catch (e) {
      return response.send(defaultMetadataTemplate(request, htmlData));
    }
  });
});

app.get('/tournaments', (request, response, next) => {
  if (!isTournamentsEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }
    return response.send(
      metadataByPageTemplate('tournaments', request, htmlData)
    );
  });
});

app.get('/tournaments/:slug', async (request, response, next) => {
  if (!isTournamentsEnabled) {
    next();
    return;
  }

  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    const tournamentSlug = request.params.slug;

    try {
      const tournament = await getTournamentBySlug(tournamentSlug);
      const { title } = tournament.data;

      return response.send(
        replaceToMetadataTemplate({
          htmlData,
          url: `${request.headers['x-forwarded-proto'] || 'http'}://${
            request.headers.host
          }/tournaments/${request.params.slug}`,
          title: `${title} - ${defaultMetadata.title}`,
          description:
            metadataByPage.tournaments.description ||
            defaultMetadata.description,
          image: `${request.headers['x-forwarded-proto'] || 'http'}://${
            request.headers.host
          }${defaultMetadata.image}`
        })
      );
    } catch (e) {
      return response.send(defaultMetadataTemplate(request, htmlData));
    }
  });
});

app.get('/leaderboard', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }
    return response.send(
      metadataByPageTemplate('leaderboard', request, htmlData)
    );
  });
});

app.get('/leaderboard/:slug', async (request, response, next) => {
  if (!isClubsEnabled) {
    next();
    return;
  }

  response.redirect(`/clubs/${request.params.slug}`);
});

app.get('/user/:address', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(defaultMetadataTemplate(request, htmlData));
  });
});

app.get('/markets/create', (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    return response.send(defaultMetadataTemplate(request, htmlData));
  });
});

app.get('/markets/:slug', async (request, response) => {
  fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
    if (error) {
      return response.status(404).end();
    }

    const marketSlug = request.params.slug;

    try {
      const market = await getMarket(marketSlug);
      const { title, category, subcategory, expiresAt, bannerUrl } =
        market.data;

      const marketMetadata = formatMarketMetadata({
        title,
        category,
        subcategory,
        expiresAt,
        bannerUrl
      });

      return response.send(
        replaceToMetadataTemplate({
          htmlData,
          url: `${request.headers['x-forwarded-proto'] || 'http'}://${
            request.headers.host
          }/markets/${request.params.slug}`,
          title: marketMetadata.title || defaultMetadata.title,
          description:
            marketMetadata.description || defaultMetadata.description,
          image:
            marketMetadata.image ||
            `${request.headers['x-forwarded-proto'] || 'http'}://${
              request.headers.host
            }${defaultMetadata.image}`
        })
      );
    } catch (e) {
      return response.send(defaultMetadataTemplate(request, htmlData));
    }
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (_request, response) => {
  response.redirect('/');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
