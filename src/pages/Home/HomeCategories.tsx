import { Category } from 'components';

import useCategories from 'hooks/useCategories';

function HomeCategories() {
  const categories = useCategories();

  return (
    <ul className="pm-p-home__categories">
      {categories?.map(category => (
        <li key={category.title}>
          <Category
            title={category.title}
            change={category.change} // change and chart disabled at the moment
            chartData={category.chartData} // change and chart disabled at the moment
            backgroundColor={category.backgroundColor}
          />
        </li>
      ))}
      {/* disabling disabled categories for testnet
      {categoriesDisabled?.map(category => (
        <li key={category.title}>
          <CategoryDisabled title={category.title} info={category.info} />
        </li>
      )) */}
    </ul>
  );
}

export default HomeCategories;
