'use client';

import { useState } from 'react';
import { Dices, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { surpriseMeAction } from '@/lib/tmdb';

export function SurpriseMeButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await surpriseMeAction();
    } catch (error) {
      console.error('Surprise me failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleClick} disabled={isLoading} aria-label="Surprise Me">
                {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                <Dices className="h-6 w-6" />
                )}
            </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Surprise Me!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
