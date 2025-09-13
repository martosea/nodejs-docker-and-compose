import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OfferInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): ReturnType<CallHandler['handle']> {
    return next.handle().pipe(map((data) => this.sanitize(data)));
  }

  private sanitize(data: Wish | Wish[]): Wish | Wish[] {
    if (Array.isArray(data)) {
      return data.map((wish) => this.hideOfferAmount(wish));
    }
    return this.hideOfferAmount(data);
  }

  private hideOfferAmount(wish: Wish): Wish {
    if (wish?.offers?.length) {
      for (const offer of wish.offers) {
        if (offer.hidden) {
          delete offer.amount;
        }
      }
    }
    return wish;
  }
}
