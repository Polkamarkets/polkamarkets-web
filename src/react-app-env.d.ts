/// <reference types="react-scripts" />


import '@tanstack/react-table'

declare module '@tanstack/react-table' {
    interface ColumnMeta {
        className?: string
    }
}
