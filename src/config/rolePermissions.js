const rolePermissions = {
    ADMIN: ['manage_all', 'view_reports', 'publish', 'read', 'write', 'delete'],
    USER: ['read', 'write','create_comment'], // المستخدم العادي (يمكن إضافة 'publish' له لاحقاً عبر قاعدة البيانات)
    GUEST: ['read'],
};

export default rolePermissions;