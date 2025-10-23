interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHeader({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: PageHeaderProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <h1 className={`text-2xl font-bold tracking-tight ${titleClassName}`}>{title}</h1>
      {description && <p className={`text-gray-500 ${descriptionClassName}`}>{description}</p>}
    </div>
  )
}
