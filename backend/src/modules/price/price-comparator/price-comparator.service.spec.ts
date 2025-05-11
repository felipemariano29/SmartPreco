import { FavoriteProductService } from '@modules/favorite/favorite-product/favorite-product.service';
import { PriceComparatorService } from '@modules/price/price-comparator/price-comparator.service';
import { PriceService } from '@modules/price/price.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClerkService } from '@shared/clerk/clerk.service';

describe('PriceComparatorService', () => {
  let service: PriceComparatorService;
  let priceService: jest.Mocked<PriceService>;
  let favoriteService: jest.Mocked<FavoriteProductService>;
  let clerkService: jest.Mocked<ClerkService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceComparatorService,
        {
          provide: PriceService,
          useValue: {
            readPriceById: jest.fn(),
            calculateAverageModeratedPriceByProductId: jest.fn(),
          },
        },
        {
          provide: FavoriteProductService,
          useValue: {
            findUserIdsByProductId: jest.fn(),
          },
        },
        {
          provide: ClerkService,
          useValue: {
            getDeviceIdByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PriceComparatorService>(PriceComparatorService);
    priceService = module.get(PriceService);
    favoriteService = module.get(FavoriteProductService);
    clerkService = module.get(ClerkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return shouldNotify=false when no users favorited', async () => {
    priceService.readPriceById.mockResolvedValueOnce({
      price: 100,
      product: { id: 'prod-1', name: 'Test Product' },
    } as any);

    favoriteService.findUserIdsByProductId.mockResolvedValueOnce([]);

    const result = await service.analyzeNewPrice('price-1');

    expect(result.shouldNotify).toBe(false);
    expect(result.usersToNotify.length).toBe(0);
  });

  it('should return shouldNotify=false when no average price', async () => {
    priceService.readPriceById.mockResolvedValueOnce({
      price: 70,
      product: { id: 'prod-1', name: 'Test Product' },
    } as any);

    favoriteService.findUserIdsByProductId.mockResolvedValueOnce([ 'user-1' ]);
    clerkService.getDeviceIdByUserId.mockResolvedValueOnce('device-1');

    priceService.calculateAverageModeratedPriceByProductId.mockResolvedValueOnce(0);

    const result = await service.analyzeNewPrice('price-1');

    expect(result.shouldNotify).toBe(false);
    expect(result.usersToNotify.length).toBe(0);
  });

  it('should return shouldNotify=false when new price is not cheaper enough', async () => {
    priceService.readPriceById.mockResolvedValueOnce({
      price: 95,
      product: { id: 'prod-1', name: 'Test Product' },
    } as any);

    favoriteService.findUserIdsByProductId.mockResolvedValueOnce([ 'user-1' ]);
    clerkService.getDeviceIdByUserId.mockResolvedValueOnce('device-1');

    priceService.calculateAverageModeratedPriceByProductId.mockResolvedValueOnce(100);

    const result = await service.analyzeNewPrice('price-1');

    expect(result.shouldNotify).toBe(false);
  });

  it('should return shouldNotify=true when new price is significantly cheaper', async () => {
    priceService.readPriceById.mockResolvedValueOnce({
      price: 60,
      product: { id: 'prod-1', name: 'Test Product' },
    } as any);

    favoriteService.findUserIdsByProductId.mockResolvedValueOnce([ 'user-1', 'user-2' ]);
    clerkService.getDeviceIdByUserId
      .mockResolvedValueOnce('device-1')
      .mockResolvedValueOnce('device-2');

    priceService.calculateAverageModeratedPriceByProductId.mockResolvedValueOnce(100);

    const result = await service.analyzeNewPrice('price-1');

    expect(result.shouldNotify).toBe(true);
    expect(result.usersToNotify.length).toBe(2);
    expect(result.usersToNotify[0].deviceId).toBe('device-1');
  });
});
