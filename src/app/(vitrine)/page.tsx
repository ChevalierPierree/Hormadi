import HeroSection from '@/components/sections/HeroSection'
import RecentResults from '@/components/sections/RecentResults'
import StandingsPreview from '@/components/sections/StandingsPreview'
import NewsPreview from '@/components/sections/NewsPreview'
import CTASection from '@/components/sections/CTASection'
import AmateurSection from '@/components/sections/AmateurSection'
import PartnersMarquee from '@/components/sections/PartnersMarquee'
import SocialCTA from '@/components/sections/SocialCTA'

export default function HomePage() {
  return (
    <div className="-mt-[5.5rem]">
      <HeroSection />
      <RecentResults />
      <StandingsPreview />
      <NewsPreview />
      <CTASection />
      <AmateurSection />
      <PartnersMarquee />
    </div>
  )
}
