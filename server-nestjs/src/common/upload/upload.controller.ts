import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// 文件魔数签名（用于校验真实文件类型）
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP 前4字节)
  ],
  'image/x-icon': [
    [0x00, 0x00, 0x01, 0x00], // ICO
    [0x00, 0x00, 0x02, 0x00], // CUR
  ],
};

/**
 * 校验文件魔数，确保文件类型真实
 */
function validateFileMagic(filePath: string, allowedTypes: string[]): boolean {
  try {
    const buffer = readFileSync(filePath);
    const header = Array.from(buffer.slice(0, 16));

    for (const type of allowedTypes) {
      const signatures = FILE_SIGNATURES[type];
      if (!signatures) continue;

      for (const sig of signatures) {
        const match = sig.every((byte, i) => header[i] === byte);
        if (match) return true;
      }
    }

    // SVG 是文本文件，检查是否以 < 开头（XML/SVG）
    if (allowedTypes.includes('image/svg+xml')) {
      const content = buffer.toString('utf8', 0, 1000).trim();
      if (
        content.startsWith('<?xml') ||
        content.startsWith('<svg') ||
        content.includes('<svg')
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * 清理 SVG 文件中的潜在恶意内容
 */
function sanitizeSvg(filePath: string): void {
  try {
    let content = readFileSync(filePath, 'utf8');

    // 移除 script 标签
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    // 移除 on* 事件属性
    content = content.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    // 移除 javascript: 协议
    content = content.replace(/javascript:/gi, '');
    // 移除 data: 协议（可能包含恶意内容）
    content = content.replace(/data:[^"'\s]*/gi, '');

    writeFileSync(filePath, content, 'utf8');
  } catch {
    // 清理失败则删除文件
    unlinkSync(filePath);
    throw new BadRequestException('SVG 文件处理失败');
  }
}

/**
 * 清理文件名，防止路径遍历攻击
 */
function sanitizeFilename(filename: string): string {
  // 只保留文件扩展名
  const ext = extname(filename).toLowerCase();
  // 白名单扩展名
  const allowedExts = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.ico',
  ];
  if (!allowedExts.includes(ext)) {
    return '.png'; // 默认扩展名
  }
  return ext;
}

@ApiTags('文件上传')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadController {
  /**
   * 上传头像
   */
  @Post('avatar')
  @ApiOperation({ summary: '上传用户头像' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = sanitizeFilename(file.originalname);
          cb(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // MIME 类型白名单
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              '只支持图片格式 (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    // 二次校验：检查文件魔数
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validateFileMagic(file.path, allowedTypes)) {
      unlinkSync(file.path); // 删除可疑文件
      throw new BadRequestException('文件类型不合法，请上传真实的图片文件');
    }

    const fileUrl = `/uploads/avatars/${file.filename}`;
    return {
      url: fileUrl,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  /**
   * 上传系统文件（Logo/Favicon等）
   * 注意：此接口应限制为管理员使用
   */
  @Post('system')
  @ApiOperation({ summary: '上传系统文件（Logo/Favicon）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'system');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = sanitizeFilename(file.originalname);
          cb(null, `sys-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // MIME 类型白名单
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/x-icon',
          'image/vnd.microsoft.icon',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              '只支持图片格式 (jpg, jpeg, png, gif, webp, svg, ico)',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadSystem(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    // 二次校验：检查文件魔数
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
    ];
    if (!validateFileMagic(file.path, allowedTypes)) {
      unlinkSync(file.path);
      throw new BadRequestException('文件类型不合法，请上传真实的图片文件');
    }

    // SVG 文件安全处理
    if (
      file.mimetype === 'image/svg+xml' ||
      file.originalname.toLowerCase().endsWith('.svg')
    ) {
      sanitizeSvg(file.path);
    }

    const fileUrl = `/uploads/system/${file.filename}`;
    return {
      url: fileUrl,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
