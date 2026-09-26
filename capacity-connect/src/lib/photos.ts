// Photos sourced from Wikimedia Commons, resized and converted to WebP.
// CC BY-SA requires attribution and that the adapted images keep the same licence;
// the credits are rendered on /help#credits from this list.

export interface Photo {
  src: string
  alt: string
  title: string
  author: string
  license: string
  licenseUrl?: string
  sourceUrl: string
}

export const PHOTOS = {
  lecture: {
    src: '/images/training-lecture.webp',
    alt: 'Participants seated at round tables during a lecture session of a capacity building workshop',
    title: 'Participants - Lecture Session - Capacity Building Workshop On Innovation Hub - NCSM - Kolkata',
    author: 'Biswarup Ganguly',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Participants_-_Lecture_Session_-_Capacity_Building_Workshop_On_Innovation_Hub_-_NCSM_-_Kolkata_2018-03-19_8874.JPG',
  },
  radar: {
    src: '/images/radar-kailasagiri.webp',
    alt: 'Doppler weather radar station with a white radome on Kailasagiri hill',
    title: 'Doppler Weather Radar Station on Kailasagiri (May 2019)',
    author: 'IM3847',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Doppler_Weather_Radar_Station_on_Kailasagiri_(May_2019).jpg',
  },
  handsOn: {
    src: '/images/training-handson.webp',
    alt: 'Trainees working together around a table during a hands-on workshop session',
    title: 'Hands-on Session - Capacity Building Workshop On Innovation Hub - NCSM - Kolkata',
    author: 'Biswarup Ganguly',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hands-on_Session_-_Capacity_Building_Workshop_On_Innovation_Hub_-_NCSM_-_Kolkata_2018-03-19_8890.JPG',
  },
  participants: {
    src: '/images/training-participants.webp',
    alt: 'Workshop participants listening during the opening session',
    title: 'Participants - Opening Session - Capacity Building Workshop On Innovation Hub - NCSM - Kolkata',
    author: 'Biswarup Ganguly',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Participants_-_Opening_Session_-_Capacity_Building_Workshop_On_Innovation_Hub_-_NCSM_-_Kolkata_2018-03-19_8825.JPG',
  },
  satellite: {
    src: '/images/insat-3ds.webp',
    alt: 'INSAT-3DS meteorological satellite',
    title: 'INSAT-3DS Satellite',
    author: 'Indian Space Research Organisation',
    license: 'GODL-India',
    licenseUrl: 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:INSAT-3DS_Satellite.jpg',
  },
  aws: {
    src: '/images/aws-station.webp',
    alt: 'Mast of an automatic weather station with sensors against the sky',
    title: 'AWS (Automatic Weather station)',
    author: 'Delince',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:AWS(Automatic_Weather_station).JPG',
  },
  monsoon: {
    src: '/images/monsoon-clouds.webp',
    alt: 'Dark monsoon clouds gathering over a city street',
    title: 'Monsoon clouds over Kakinada',
    author: 'Adityamadhav83',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Monsoon_clouds_over_Kakinada.jpg',
  },
  stevenson: {
    src: '/images/stevenson-screen.webp',
    alt: 'White louvred Stevenson screen housing thermometers at an observatory',
    title: 'Stevenson screen exterior',
    author: 'Unknown author',
    license: 'Public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stevenson_screen_exterior.JPG',
  },
} satisfies Record<string, Photo>

const SUBJECT_PHOTO: Record<string, Photo> = {
  'Meteorological Instruments': PHOTOS.stevenson,
  'Weather Forecasting Models': PHOTOS.monsoon,
  'Climate Data Analysis': PHOTOS.aws,
  'Satellite & Radar Systems': PHOTOS.satellite,
}

export function subjectPhoto(subject: string): Photo | undefined {
  return SUBJECT_PHOTO[subject]
}
