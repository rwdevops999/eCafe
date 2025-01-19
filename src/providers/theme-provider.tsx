import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"

const Theme = ({children}:{children: ReactNode}) => {
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
        {children}
    </ThemeProvider>
  )
}

export default Theme