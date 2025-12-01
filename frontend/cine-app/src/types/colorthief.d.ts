declare module 'colorthief' {
  export default class ColorThief {
    constructor();
    getColor(imageElement: HTMLImageElement): [number, number, number];
    getPalette(imageElement: HTMLImageElement, colorCount?: number): [number, number, number][];
  }
}