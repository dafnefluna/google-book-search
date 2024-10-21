interface GoogleAPIVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

interface GoogleAPIBook {
    id: string;
    volumeInfo: GoogleAPIVolumeInfo;
}

export type { GoogleAPIVolumeInfo, GoogleAPIBook};

