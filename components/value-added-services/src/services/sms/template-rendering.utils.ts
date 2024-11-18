import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';

@Injectable()
export class NunjucksUtils {
  private readonly env: nunjucks.Environment;

  constructor() {
    this.env = new nunjucks.Environment();
  }

  render(template: string, context: Record<string, any>): string {
    return this.env.renderString(template, context);
  }
}