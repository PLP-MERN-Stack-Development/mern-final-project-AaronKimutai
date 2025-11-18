const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const buildDisplayName = (clerkUser) => {
  const parts = [clerkUser.firstName, clerkUser.lastName].filter(Boolean);
  if (parts.length) {
    return parts.join(' ');
  }
  if (clerkUser.username) {
    return clerkUser.username;
  }
  const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
  if (primaryEmail) {
    return primaryEmail;
  }
  return 'User';
};

const requireAuth = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1. Authenticate and Fetch Clerk User Data
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!primaryEmail) {
      return res.status(400).json({ message: 'Clerk user is missing an email address' });
    }
    
    
    const clerkRole = clerkUser.publicMetadata?.appRole || 'user'; 

    const displayName = buildDisplayName(clerkUser);

    // 2. Search for existing MongoDB user
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) {
      user = await User.findOne({ email: primaryEmail });
    }

    // 3. Create or Update MongoDB User
    if (!user) {
      user = await User.create({
        name: displayName || primaryEmail, 
        email: primaryEmail,
        clerkId: clerkUser.id,
        role: clerkRole, 
      });
    } else {
      let shouldSave = false;

       
      if (!user.clerkId) {
        user.clerkId = clerkUser.id;
        shouldSave = true;
      }
        
      if (user.role !== clerkRole) {
          user.role = clerkRole;
          shouldSave = true;
      }

      
      if (user.name !== displayName && displayName) { 
        user.name = displayName;
        shouldSave = true;
      }

      // Sync email if changed 
      if (user.email !== primaryEmail) {
        user.email = primaryEmail;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    
    req.user = user;
    req.clerkUser = clerkUser;

    next();
  } catch (error) {
    console.error('Clerk authentication failed during sync:', error); 
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { requireAuth };
