import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MailService } from './mail.service';

@UseGuards(JwtAuthGuard)
@Controller('system/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * 测试邮件发送
   */
  @Post('test')
  async testMail() {
    return this.mailService.testMail();
  }
}
