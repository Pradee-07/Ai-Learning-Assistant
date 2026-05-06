import React from 'react'

const PageHeader = ({title, subtitle, children}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight mb-2 break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-sm break-words">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="w-full sm:w-auto">{children}</div>}
    </div>
  )
}

export default PageHeader
