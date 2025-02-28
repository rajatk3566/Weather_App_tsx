 export interface WeatherData {
    name: string;
    main: {
      temp: number;
      humidity: number;
    };
    sys:{
        country:string;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
  }
  