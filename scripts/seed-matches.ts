import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MATCHES = [
  // Playdowns J3 - 20 mars 2026
  {
    date: new Date('2026-03-20T20:30:00'),
    homeTeam: 'Jokers de Cergy-Pontoise',
    awayTeam: 'Hormadi Anglet',
    homeScore: 1,
    awayScore: 3,
    venue: "AREN'ICE, Cergy-Pontoise",
    status: 'finished',
    isHomeGame: false,
  },
  // Playdowns J4 - 26 mars 2026
  {
    date: new Date('2026-03-26T20:30:00'),
    homeTeam: 'Hormadi Anglet',
    awayTeam: 'Diables Rouges de Briançon',
    homeScore: 3,
    awayScore: 0,
    venue: 'Patinoire de la Barre',
    status: 'finished',
    isHomeGame: true,
  },
  // Playdowns J5 - 28 mars 2026
  {
    date: new Date('2026-03-28T20:30:00'),
    homeTeam: 'Rapaces de Gap',
    awayTeam: 'Hormadi Anglet',
    homeScore: 4,
    awayScore: 2,
    venue: 'Patinoire Alpine, Gap',
    status: 'finished',
    isHomeGame: false,
  },
  // Prochain match - Playdowns J6 - 4 avril 2026
  {
    date: new Date('2026-04-04T20:30:00'),
    homeTeam: 'Hormadi Anglet',
    awayTeam: 'Rapaces de Gap',
    homeScore: null,
    awayScore: null,
    venue: 'Patinoire de la Barre',
    status: 'scheduled',
    isHomeGame: true,
  },
  // Playdowns J7 - 7 avril 2026
  {
    date: new Date('2026-04-07T20:30:00'),
    homeTeam: 'Pionniers de Chamonix',
    awayTeam: 'Hormadi Anglet',
    homeScore: null,
    awayScore: null,
    venue: 'Patinoire Richard Bozon, Chamonix',
    status: 'scheduled',
    isHomeGame: false,
  },
]

async function main() {
  console.log('Seeding matches...')

  // Check existing matches
  const existing = await prisma.match.count()
  console.log(`Found ${existing} existing matches in database`)

  for (const match of MATCHES) {
    // Check if match already exists (same date + teams)
    const exists = await prisma.match.findFirst({
      where: {
        date: match.date,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
      },
    })

    if (exists) {
      console.log(`  Already exists: ${match.homeTeam} vs ${match.awayTeam} (${match.date.toLocaleDateString('fr-FR')})`)
      // Update scores if match is finished
      if (match.status === 'finished' && exists.status !== 'finished') {
        await prisma.match.update({
          where: { id: exists.id },
          data: {
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            status: match.status,
          },
        })
        console.log(`    -> Updated with score: ${match.homeScore}-${match.awayScore}`)
      }
      continue
    }

    await prisma.match.create({ data: match })
    const scoreStr = match.homeScore !== null ? ` (${match.homeScore}-${match.awayScore})` : ' (à venir)'
    console.log(`  Created: ${match.homeTeam} vs ${match.awayTeam}${scoreStr}`)
  }

  const total = await prisma.match.count()
  console.log(`\nDone! Total matches in database: ${total}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
