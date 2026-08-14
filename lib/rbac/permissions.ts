export const PERMISSIONS = {
    // User Management
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    
    // Campaign Management
    CAMPAIGN_CREATE: 'campaign:create',
    CAMPAIGN_READ: 'campaign:read',
    CAMPAIGN_UPDATE: 'campaign:update',
    CAMPAIGN_DELETE: 'campaign:delete',
    
    // Banner Management
    BANNER_CREATE: 'banner:create',
    BANNER_READ: 'banner:read',
    BANNER_UPDATE: 'banner:update',
    BANNER_DELETE: 'banner:delete',
    
    // Gallery Management
    GALLERY_CREATE: 'gallery:create',
    GALLERY_READ: 'gallery:read',
    GALLERY_UPDATE: 'gallery:update',
    GALLERY_DELETE: 'gallery:delete',
    
    // Copy Text Management
    COPY_TEXT_CREATE: 'copy-text:create',
    COPY_TEXT_READ: 'copy-text:read',
    COPY_TEXT_UPDATE: 'copy-text:update',
    COPY_TEXT_DELETE: 'copy-text:delete',
  } as const
  
  export const ROLE_PERMISSIONS = {
    ADMIN: Object.values(PERMISSIONS),
    MANAGER: [
      PERMISSIONS.CAMPAIGN_CREATE,
      PERMISSIONS.CAMPAIGN_READ,
      PERMISSIONS.CAMPAIGN_UPDATE,
    ],
    USER: [
      PERMISSIONS.CAMPAIGN_READ,
      PERMISSIONS.BANNER_READ,
      PERMISSIONS.GALLERY_READ,
      PERMISSIONS.COPY_TEXT_READ,
    ],
  } as const