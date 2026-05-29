declare module '@mapbox/polyline' {
  const polyline: {
    decode: (encoded: string) => Array<[number, number]>;
    encode: (points: Array<[number, number]>) => string;
  };

  export default polyline;
}
