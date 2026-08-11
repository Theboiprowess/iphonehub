# AI Customer Support System - Setup Guide

## Overview

The iPhone Hub Masvingo website now includes a complete AI-powered customer support system that integrates with your existing database, products, and business information.

## Features

### Customer-Facing
- **Chat Widget**: Floating chat button in bottom-right corner
- **Natural Language**: Customers can ask questions in normal English
- **Product Search**: AI searches real product database
- **Product Recommendations**: AI recommends based on budget, preferences
- **Real-Time Data**: Uses current prices, stock, and product info
- **Never Hallucinates**: Only uses actual database information
- **Human Escalation**: Automatically escalates complex issues to human support
- **WhatsApp Integration**: Direct WhatsApp contact when needed

### Admin Dashboard
- **Support Dashboard**: Overview of all support activity
- **Knowledge Base**: Create and manage AI knowledge articles
- **Unanswered Questions**: Review and answer questions AI couldn't handle
- **Conversation Viewer**: View all customer conversations
- **Analytics**: Track support performance metrics

## Prerequisites

### 1. OpenAI API Key (Required)

The AI support system requires an OpenAI API key to function.

**Steps:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Upstash Redis (Optional - for production rate limiting)

For production rate limiting, you can use Upstash Redis. For development, the system uses in-memory rate limiting.

**Steps:**
1. Go to https://upstash.com/
2. Create a free account
3. Create a new Redis database
4. Copy the REST URL and token

## Setup Steps

### Step 1: Add Environment Variables

Add the following to your `.env` file:

```env
# Required for AI Support
OPENAI_API_KEY="sk-your-actual-openai-api-key-here"

# Optional - for production rate limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

**Important:** Replace `sk-your-actual-openai-api-key-here` with your actual OpenAI API key.

### Step 2: Push Database Schema

The AI support system adds new tables to your database. Run:

```bash
npx prisma db push
```

This will create the following tables:
- `SupportConversation` - Stores chat conversations
- `SupportMessage` - Stores individual messages
- `SupportEscalation` - Tracks escalated conversations
- `KnowledgeArticle` - AI knowledge base articles
- `UnansweredQuestion` - Questions AI couldn't answer
- `SupportSettings` - AI configuration

### Step 3: Verify Installation

Check that these files exist:
- `src/lib/support-context.ts` - Context retrieval system
- `src/app/api/support/chat/route.ts` - Chat API endpoint
- `src/components/support/chat-widget.tsx` - Chat widget
- `src/app/admin/(protected)/support/page.tsx` - Admin dashboard

### Step 4: Test Locally

1. Start your development server:
```bash
npm run dev
```

2. Visit http://localhost:3000

3. Click the chat widget (bottom-right corner)

4. Try asking questions:
   - "What iPhones do you have?"
   - "How much is the iPhone 15?"
   - "Do you accept trade-ins?"

## Admin Dashboard Access

Navigate to: `/admin/support`

### Pages Available:
- **Dashboard** (`/admin/support`) - Overview and quick actions
- **Conversations** (`/admin/support/conversations`) - View all chats
- **Knowledge Base** (`/admin/support/knowledge`) - Manage AI knowledge
- **Unanswered Questions** (`/admin/support/unanswered`) - Review unanswered
- **Analytics** (`/admin/support/analytics`) - Performance metrics

## Knowledge Base Management

### Adding Knowledge Articles

1. Go to `/admin/support/knowledge`
2. Click "New Article"
3. Fill in:
   - **Title**: Article title
   - **Category**: Products, Trade-In, Delivery, Payment, Warranty, Returns, General
   - **Content**: Detailed information for the AI
   - **Tags**: Comma-separated keywords
   - **Status**: Draft or Published
4. Click "Save Article"

### When to Add Knowledge Articles

Add articles when:
- You want the AI to have specific information
- You want to explain complex processes (e.g., detailed trade-in steps)
- You want to provide policy details
- You want to add FAQs not in the main FAQ system

## Unanswered Questions

### How It Works

When the AI cannot confidently answer a question:
1. The question is saved to "Unanswered Questions"
2. The AI gives a fallback response
3. The customer is offered human support

### Managing Unanswered Questions

1. Go to `/admin/support/unanswered`
2. Review pending questions
3. Click "Answer" on a question
4. Provide your answer
5. Optionally check "Add to knowledge base"
6. Click "Submit Answer"

## Conversation Management

### Viewing Conversations

1. Go to `/admin/support/conversations`
2. Filter by status (Open, In Progress, Escalated, Resolved, Closed)
3. Click on a conversation to view the full chat history
4. Update status as needed

### Status Meanings

- **Open**: New conversation, active
- **In Progress**: Being handled
- **Escalated**: Sent to human support
- **Resolved**: Successfully completed
- **Closed**: No longer active

## Security Features

### API Key Protection
- OpenAI API key is server-side only
- Never exposed to browser
- Stored in environment variables

### Rate Limiting
- 10 requests per minute per session
- 100 requests per hour per session
- In-memory fallback if Redis not configured

### Admin Protection
- All admin routes require authentication
- Only ADMIN and SUPER_ADMIN roles can access
- Standard NextAuth middleware

## Customization

### AI Personality

Edit the system prompt in `src/app/api/support/chat/route.ts`:
- Business information
- Tone and style
- Escalation triggers
- Response guidelines

### Chat Widget Styling

Edit `src/components/support/chat-widget.tsx`:
- Colors and theme
- Button styles
- Quick actions
- Layout

### Rate Limits

Edit in `src/app/api/support/chat/route.ts`:
```typescript
ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 per minute
});
```

## Testing Checklist

### Basic Functionality
- [ ] Chat widget appears on website
- [ ] Can send messages
- [ ] AI responds to questions
- [ ] Product search works
- [ ] Product recommendations work
- [ ] WhatsApp contact shows on escalation

### Admin Dashboard
- [ ] Can access /admin/support
- [ ] Can view conversations
- [ ] Can create knowledge articles
- [ ] Can answer unanswered questions
- [ ] Can view analytics

### Edge Cases
- [ ] AI handles unknown questions gracefully
- [ ] Escalation works correctly
- [ ] Rate limiting prevents abuse
- [ ] Database errors don't crash the system

## Troubleshooting

### Chat Not Working

**Problem:** Chat widget doesn't respond

**Solutions:**
1. Check OPENAI_API_KEY is set in .env
2. Verify API key is valid and has credits
3. Check browser console for errors
4. Verify /api/support/chat is accessible

### No Products Found

**Problem:** AI says no products when they exist

**Solutions:**
1. Check products have status = PUBLISHED
2. Check products have isActive = true
3. Check variants have isActive = true
4. Verify database connection

### Admin Pages Not Accessible

**Problem:** Can't access /admin/support

**Solutions:**
1. Verify you're logged in
2. Check user role is ADMIN or SUPER_ADMIN
3. Verify NextAuth is working
4. Check middleware configuration

## Cost Considerations

### OpenAI API Costs

Using `gpt-4o-mini`:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- Typical conversation: ~$0.001 - $0.01

Estimated monthly costs:
- 100 conversations/day: ~$3-10
- 1000 conversations/day: ~$30-100

### Upstash Redis (Optional)

Free tier: 10,000 commands/day
Paid tiers available for higher volume

## Production Deployment

### Vercel Environment Variables

Add these in Vercel dashboard:
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL` (optional)
- `UPSTASH_REDIS_REST_TOKEN` (optional)

### Database Migration

The schema will be pushed automatically on deployment if you have:
- Proper DATABASE_URL configured
- Prisma client generated

## Monitoring

### Key Metrics to Track

- Total conversations per day
- Average response time
- Escalation rate
- Unanswered questions
- Knowledge article usage
- Customer satisfaction

### Where to Find Metrics

1. Admin Dashboard → Support → Analytics
2. Direct database queries
3. Upstash Redis (if configured)
4. OpenAI dashboard (API usage)

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check OpenAI API status
4. Verify database connection
5. Check environment variables

## Next Steps

1. Set up your OpenAI API key
2. Test the chat widget locally
3. Add initial knowledge articles
4. Monitor first conversations
5. Adjust AI personality as needed
6. Scale rate limiting if needed
