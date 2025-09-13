import { IPlanRepository } from "../../repositories/IPlanRepository";

interface IExecuteListPlansUseCase {
  page?: number;
  limit?: number;
  search?: string;
}

export class ListPlansUseCase {
  constructor(private readonly planRepository: IPlanRepository) { }

  async execute({
    limit,
    page = 1,
    search = '',
  }: IExecuteListPlansUseCase) {
    const [data, count] = await Promise.all([
      this.planRepository.list({
        limit,
        page,
        search,
      }),
      this.planRepository.count({
        search,
      })
    ])

    const formattedData = data?.map((item) => ({
      ...item,
      value: item?.value ? Number(item.value).toFixed(2) : "0.00",
    }));

    return {
      count,
      data: formattedData,
    };
  }
}
