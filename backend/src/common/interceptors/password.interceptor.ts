import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(map((data: unknown) => this.removePasswordField(data)));
  }

  private removePasswordField(data: unknown): unknown {
    const seen = new WeakSet();

    const isPlainObject = (val: unknown): val is Record<string, unknown> =>
      Object.prototype.toString.call(val) === '[object Object]';

    const walk = (val: unknown): unknown => {
      if (Array.isArray(val)) {
        return val.map((item) => walk(item));
      }
      if (val && isPlainObject(val)) {
        if (seen.has(val)) return val;
        seen.add(val);
        const entries = Object.entries(val).filter(([k]) => k !== 'password');
        const out: Record<string, unknown> = {};
        for (const [k, v] of entries) {
          out[k] = walk(v);
        }
        return out;
      }
      return val;
    };

    return walk(data);
  }
}
