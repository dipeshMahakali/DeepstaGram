import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Deepsta Database...');

  // Clean existing data
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversationMember.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.storyView.deleteMany({});
  await prisma.story.deleteMany({});
  await prisma.reel.deleteMany({});
  await prisma.commentLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.save.deleteMany({});
  await prisma.postMedia.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Main Demo User
  const alex = await prisma.user.create({
    data: {
      email: 'alex.morgan@gmail.com',
      username: 'alex_deepsta',
      name: 'Alex Morgan',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
      bio: '✨ Digital Creator & UI Architect\n🚀 Crafting deep, vibrant social experiences\n📍 San Francisco, CA',
      website: 'deepsta.app/alex',
      isVerified: true,
    },
  });

  // 2. Create Additional Users
  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.vibes@gmail.com',
      username: 'sarah_vibes',
      name: 'Sarah Miller',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      bio: 'Neon aesthetics & midnight vibes ✨ Shibuya explorer 🌃',
      isVerified: true,
    },
  });

  const alexDev = await prisma.user.create({
    data: {
      email: 'alex.dev@gmail.com',
      username: 'alex_dev',
      name: 'Alex Johnson',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      bio: 'Building full-stack mobile apps 📱 React Native & Node.js',
      isVerified: false,
    },
  });

  const maya = await prisma.user.create({
    data: {
      email: 'maya.lin@gmail.com',
      username: 'creative_maya',
      name: 'Maya Lin',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
      bio: 'Travel photography & sunset collector 🌅',
      isVerified: true,
    },
  });

  const jason = await prisma.user.create({
    data: {
      email: 'jason.photo@gmail.com',
      username: 'jason_photo',
      name: 'Jason Reed',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      bio: 'Landscape & street photographer 📸',
      isVerified: false,
    },
  });

  // 3. Create Follows
  await prisma.follow.createMany({
    data: [
      { followerId: alex.id, followingId: sarah.id, status: 'ACCEPTED' },
      { followerId: alex.id, followingId: alexDev.id, status: 'ACCEPTED' },
      { followerId: sarah.id, followingId: alex.id, status: 'ACCEPTED' },
      { followerId: maya.id, followingId: alex.id, status: 'ACCEPTED' },
      { followerId: jason.id, followingId: alex.id, status: 'ACCEPTED' },
    ],
  });

  // 4. Create Posts
  const post1 = await prisma.post.create({
    data: {
      userId: sarah.id,
      caption: 'Lost in the neon glow of the midnight aesthetic. What vibe are you tuning into today? ✨ #DeepstaVibes #CyberAesthetics #NeonGlow',
      location: 'Cyber Neon District • Tokyo',
      audioTitle: 'Midnight Vibe (Original Audio)',
      audioArtist: 'Deepsta Beats',
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
            type: 'IMAGE',
            orderIndex: 0,
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      userId: alexDev.id,
      caption: 'Building the next evolution of social experience with React Native and Expo! 🚀 Code and coffee.',
      location: 'Silicon Valley, CA',
      audioTitle: 'Lo-Fi Chill Code',
      audioArtist: 'Synthwave Labs',
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
            type: 'IMAGE',
            orderIndex: 0,
          },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      userId: maya.id,
      caption: 'Golden hour waves in Bali 🌊 Real magic moments #OceanLife #Travel',
      location: 'Uluwatu, Bali',
      audioTitle: 'Sunset Chill • Lo-Fi Dreams',
      audioArtist: 'Aesthetic Beats',
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
            type: 'IMAGE',
            orderIndex: 0,
          },
        ],
      },
    },
  });

  // 5. Likes and Comments
  await prisma.like.createMany({
    data: [
      { userId: alex.id, postId: post1.id },
      { userId: alex.id, postId: post2.id },
      { userId: sarah.id, postId: post2.id },
      { userId: alexDev.id, postId: post1.id },
    ],
  });

  await prisma.comment.createMany({
    data: [
      {
        userId: alex.id,
        postId: post1.id,
        content: 'This lighting is absolutely legendary! 🔥',
      },
      {
        userId: alexDev.id,
        postId: post1.id,
        content: 'Shibuya neon hits different 🌌',
      },
      {
        userId: sarah.id,
        postId: post2.id,
        content: 'Awesome progress on the mobile UI! 👏',
      },
    ],
  });

  // 6. Stories (Active for 24h)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.story.createMany({
    data: [
      {
        userId: sarah.id,
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        type: 'IMAGE',
        expiresAt: tomorrow,
      },
      {
        userId: alexDev.id,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        type: 'IMAGE',
        expiresAt: tomorrow,
      },
      {
        userId: maya.id,
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
        type: 'IMAGE',
        expiresAt: tomorrow,
      },
    ],
  });

  // 7. Reels
  await prisma.reel.createMany({
    data: [
      {
        userId: sarah.id,
        videoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
        caption: 'Exploring neon alleyways in Shibuya 🌃✨ #TokyoVibes #Deepsta #Neon',
        audioTitle: 'Cyberpunk Odyssey (Synthwave Vibe)',
        audioArtist: 'Deepsta Audio',
      },
      {
        userId: maya.id,
        videoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
        caption: 'Golden hour waves in Bali 🌊 Real magic moments #OceanLife #Travel',
        audioTitle: 'Sunset Chill • Lo-Fi Dreams',
        audioArtist: 'Aesthetic Beats',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
