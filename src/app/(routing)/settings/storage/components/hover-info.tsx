import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Info } from 'lucide-react'
import React from 'react'

const HoverInfo = ({title, message, nextline}:{title:string, message: string, nextline?: string}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
          <Info width={16} height={16} className="text-blue-400" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 border border-foreground/50">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-500">{title}</h4>
            <p className="text-sm">
              {message}
            </p>
            {/* {nextline &&  */}
                <p className="text-sm">
                    {nextline}
                </p>
            {/* } */}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverInfo