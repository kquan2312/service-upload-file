import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductService price CRUD', () => {
  let service: ProductService;
  let repository: jest.Mocked<
    Pick<
      Repository<Product>,
      'create' | 'save' | 'findOneBy' | 'update' | 'findOne'
    >
  >;

  beforeEach(() => {
    repository = {
      create: jest.fn((product) => product as Product),
      save: jest.fn((product) => Promise.resolve(product as Product)),
      findOneBy: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };
    service = new ProductService(repository as unknown as Repository<Product>);
  });

  it('creates a product with a complete structured price', async () => {
    const dto: CreateProductDto = {
      name: 'Product',
      price: { fes: 120 },
    };

    await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      price: { fes: 120, testShoot: null },
    });
    expect(repository.save).toHaveBeenCalled();
  });

  it('updates one price field without replacing the other', async () => {
    repository.findOneBy.mockResolvedValue({
      price: { fes: 100, testShoot: 50 },
    } as Product);
    repository.findOne.mockResolvedValue({
      id: 'product-id',
      price: { fes: 125, testShoot: 50 },
    } as Product);

    await service.update('product-id', { price: { fes: 125 } });

    expect(repository.update).toHaveBeenCalledWith('product-id', {
      price: { fes: 125, testShoot: 50 },
    });
  });

  it('allows clearing one price field while preserving the other', async () => {
    repository.findOneBy.mockResolvedValue({
      price: { fes: 100, testShoot: 50 },
    } as Product);
    repository.findOne.mockResolvedValue({
      id: 'product-id',
      price: { fes: null, testShoot: 50 },
    } as Product);

    await service.update('product-id', { price: { fes: null } });

    expect(repository.update).toHaveBeenCalledWith('product-id', {
      price: { fes: null, testShoot: 50 },
    });
  });

  it('clears the structured price when price is explicitly null', async () => {
    repository.findOne.mockResolvedValue({
      id: 'product-id',
      price: null,
    } as Product);

    await service.update('product-id', { price: null });

    expect(repository.findOneBy).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith('product-id', {
      price: null,
    });
  });
});
