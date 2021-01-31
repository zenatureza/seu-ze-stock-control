import ICreateOrderProductDTO from './ICreateOrderProductDTO';

export default interface IGetOrderDTO {
  id: string;
  products: ICreateOrderProductDTO[];
  total: number;
}
