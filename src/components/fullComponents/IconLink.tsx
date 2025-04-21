import React from "react"
type IconLinkProps = {
    href: string
    size?: number
  }
  
 const IconLink = ({ href, size = 24, children }: React.PropsWithChildren<IconLinkProps>) => {
    return (
      <span className="hover:bg-primary/20 duration-300 transition-colors rounded-full p-2">
        <a href={href} className="text-primary">
          {children}
        </a>
      </span>
    )
  }

  export default IconLink
  