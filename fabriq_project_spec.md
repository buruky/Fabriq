# Fabriq - Wardrobe Management App
## Complete Project Specification

---

## 1. PROJECT OVERVIEW

### Project Name
**Fabriq**

### Elevator Pitch
Fabriq is a wardrobe management app that keeps all of your clothes in one central place. You can organize your wardrobe, create outfits manually, and save your favorite combinations for easy access.

### Problem Statement
People struggle to remember what clothes they own, leading to:
- Forgetting about items buried in the closet
- Unnecessary purchases of similar items
- Wasting time deciding what to wear
- Difficulty planning outfits in advance

### Target Audience
- **Primary users:** Fashion-conscious individuals who want to organize their wardrobe
- **Age range:** 16-45 (mobile-savvy users)
- **Use cases:** Daily outfit planning, closet organization, reducing decision fatigue

---

## 2. CORE FEATURES (MVP)

### Must-Have Features
1. ✅ User authentication (register, login, logout)
2. ✅ Add clothing items with photos, names, and categories
3. ✅ View wardrobe in organized grid/list
4. ✅ Edit and delete clothing items
5. ✅ Create outfits manually by selecting items
6. ✅ Save outfits with names
7. ✅ View all saved outfits
8. ✅ Edit and delete outfits
9. ✅ User profile page

### Future Features (Post-MVP)
- 🔮 AI-powered outfit suggestions from inspiration images
- 🔮 Outfit recommendations based on weather
- 🔮 Analytics (most/least worn items)
- 🔮 Social sharing of outfits
- 🔮 Bulk upload of clothing items

---

## 3. USER AUTHENTICATION

### Authentication Provider
**Supabase Auth** (includes database + auth + storage in one service)

*Alternative options: Clerk, Firebase Auth*

### User Roles
- **Regular User** - standard user with personal wardrobe
- **Admin** - (future) manage reported content, user support

### Registration Requirements
**Required fields:**
- Email
- Password
- Username

**Optional fields:**
- Profile picture
- Display name

### Social Login (Optional for MVP)
- Google OAuth
- Apple Sign In

---

## 4. DATABASE DESIGN

### Database
**PostgreSQL** (via Supabase)

### Data Models

#### User
```javascript
User {
  id: uuid (primary key)
  email: string (unique)
  username: string (unique)
  displayName: string?
  profilePictureUrl: string?
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### ClothingItem
```javascript
ClothingItem {
  id: uuid (primary key)
  userId: uuid (foreign key → User)
  name: string
  category: string (enum: 'tops', 'bottoms', 'shoes', 'outerwear', 'accessories')
  subcategory: string? ('t-shirt', 'jeans', 'sneakers', etc.)
  colors: string[] (array of color names or hex codes)
  imageUrl: string
  brand: string?
  description: string?
  season: string[] ('spring', 'summer', 'fall', 'winter', 'all-season')
  isFavorite: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Outfit
```javascript
Outfit {
  id: uuid (primary key)
  userId: uuid (foreign key → User)
  name: string
  clothingItemIds: uuid[] (array of ClothingItem IDs)
  notes: string?
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Relationships
- `User` → `ClothingItem`: **one-to-many**
- `User` → `Outfit`: **one-to-many**
- `Outfit` → `ClothingItem`: **many-to-many** (through clothingItemIds array)

### Category Taxonomy
```javascript
CATEGORIES = {
  tops: ['t-shirt', 'blouse', 'sweater', 'tank-top', 'dress-shirt', 'hoodie'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
  shoes: ['sneakers', 'boots', 'heels', 'sandals', 'flats'],
  outerwear: ['jacket', 'coat', 'blazer', 'cardigan', 'vest'],
  accessories: ['hat', 'bag', 'scarf', 'belt', 'jewelry', 'sunglasses']
}
```

---

## 5. API ARCHITECTURE

### Backend Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-app.com/api`

### API Endpoints

#### Authentication (Handled by Supabase)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/user` - Get current user info

#### Clothing Items
```
GET    /api/clothing              Get all user's clothing items
GET    /api/clothing/:id          Get specific clothing item
POST   /api/clothing              Create new clothing item
PUT    /api/clothing/:id          Update clothing item
DELETE /api/clothing/:id          Delete clothing item
```

**POST /api/clothing** - Create new item
```json
Request Body:
{
  "name": "Blue Denim Jacket",
  "category": "outerwear",
  "subcategory": "jacket",
  "colors": ["blue", "indigo"],
  "imageUrl": "https://...",
  "brand": "Levi's",
  "description": "Classic denim jacket",
  "season": ["spring", "fall"]
}

Response:
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Blue Denim Jacket",
  ...
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Outfits
```
GET    /api/outfits               Get all user's outfits
GET    /api/outfits/:id           Get specific outfit with items
POST   /api/outfits               Create new outfit
PUT    /api/outfits/:id           Update outfit
DELETE /api/outfits/:id           Delete outfit
```

**POST /api/outfits** - Create new outfit
```json
Request Body:
{
  "name": "Casual Friday",
  "clothingItemIds": ["uuid1", "uuid2", "uuid3"],
  "notes": "Comfortable for the office"
}

Response:
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Casual Friday",
  "clothingItemIds": ["uuid1", "uuid2", "uuid3"],
  "notes": "Comfortable for the office",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**GET /api/outfits/:id** - Get outfit with full item details
```json
Response:
{
  "id": "uuid",
  "name": "Casual Friday",
  "items": [
    {
      "id": "uuid1",
      "name": "White T-Shirt",
      "category": "tops",
      "imageUrl": "https://..."
    },
    {
      "id": "uuid2",
      "name": "Blue Jeans",
      "category": "bottoms",
      "imageUrl": "https://..."
    }
  ],
  "notes": "Comfortable for the office",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### User Profile
```
GET    /api/user/profile          Get user profile
PUT    /api/user/profile          Update profile
GET    /api/user/stats            Get wardrobe statistics
```

**GET /api/user/stats**
```json
Response:
{
  "totalItems": 42,
  "totalOutfits": 8,
  "itemsByCategory": {
    "tops": 15,
    "bottoms": 10,
    "shoes": 8,
    "outerwear": 5,
    "accessories": 4
  }
}
```

---

## 6. TECHNOLOGY STACK

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript (recommended) or JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API + useState
- **Routing:** React Router v6
- **HTTP Client:** Axios or Fetch API
- **Form Handling:** React Hook Form
- **Image Upload:** react-dropzone

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript or JavaScript
- **Authentication:** Supabase Auth
- **File Upload:** Multer (if handling uploads) or direct to Cloudinary

### Database
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Supabase Client SDK or Prisma

### File Storage
- **Service:** Cloudinary (recommended)
  - Free tier: 25GB storage, 25GB bandwidth/month
  - Automatic image optimization and resizing
  - Direct upload from frontend

*Alternative: Supabase Storage*

### Deployment

#### Frontend
- **Platform:** Vercel
- **Build:** Automatic from GitHub
- **Environment:** Production + Preview branches

#### Backend
- **Platform:** Railway or Render
- **Database:** Supabase (hosted PostgreSQL)
- **Environment Variables:** Managed in platform dashboard

---

## 7. USER INTERFACE DESIGN

### Pages & Routes

#### Public Pages (No Auth Required)
- `/` - Landing page (hero, features, CTA to sign up)
- `/login` - Login page
- `/register` - Registration page

#### Protected Pages (Auth Required)
- `/dashboard` - Main dashboard (overview of wardrobe + recent outfits)
- `/wardrobe` - View all clothing items (grid view with filters)
- `/wardrobe/add` - Add new clothing item
- `/wardrobe/:id` - View/edit specific item
- `/outfits` - View all saved outfits
- `/outfits/create` - Create new outfit manually
- `/outfits/:id` - View/edit specific outfit
- `/profile` - User profile and settings

### Design Style
- **Visual Style:** Modern, clean, minimalist
- **Inspiration:** Pinterest boards, fashion apps like Stylitics, Whering

### Color Scheme
- **Primary:** #992A8B (deep purple/magenta)
- **Secondary:** #BF7587 (muted rose)
- **Accent:** #E68057 (coral/orange)
- **Neutral:** 
  - Background: #F9FAFB (light gray)
  - Text: #111827 (dark gray)
  - Borders: #E5E7EB (light gray)

### Key UI Components
- **Clothing Item Card:** Image, name, category badge
- **Outfit Card:** Grid of item images, outfit name
- **Filter Bar:** Category chips, search input
- **Upload Modal:** Drag-and-drop or click to upload
- **Loading States:** Skeleton screens for grids
- **Empty States:** Friendly messages with CTA buttons

---

## 8. USER FLOWS

### Flow 1: Add Clothing Item
1. User clicks **"Add Item"** button in wardrobe
2. Modal/page opens with upload area
3. User uploads image from computer or phone camera
4. Image previews
5. User fills in:
   - Item name (required)
   - Category dropdown (required)
   - Subcategory dropdown (optional)
   - Colors (select from palette or type)
   - Brand (optional)
   - Description (optional)
   - Season checkboxes
6. User clicks **"Save"** or **"Cancel"**
7. If saved, item appears in wardrobe immediately
8. Success message displays

### Flow 2: Create Outfit Manually
1. User navigates to **"Create Outfit"** page
2. Page shows all user's clothing items in a grid
3. User clicks items to add them to outfit (visual feedback - checkmark or border)
4. Selected items appear in **"Current Outfit"** section on the side/bottom
5. User can click selected items to remove them
6. User enters outfit name (required)
7. User adds optional notes
8. User clicks **"Save Outfit"**
9. Outfit is saved and user redirects to outfit detail page
10. Success message displays

### Flow 3: Edit Clothing Item
1. User clicks clothing item card in wardrobe
2. Item detail view opens (modal or page)
3. User clicks **"Edit"** button
4. All fields become editable (pre-populated with current data)
5. User can change:
   - Name
   - Category/subcategory
   - Colors
   - Brand
   - Description
   - Season
   - Replace image (optional)
6. User clicks **"Save Changes"** or **"Cancel"**
7. If saved, item updates immediately
8. User sees **"Delete"** button with confirmation modal

### Flow 4: View and Manage Outfits
1. User navigates to **"My Outfits"** page
2. All saved outfits display in grid (cards with mini previews)
3. User clicks outfit card
4. Outfit detail page shows:
   - All items in the outfit (larger images)
   - Outfit name and notes
   - Creation date
5. User can:
   - **Edit** - modify items or name
   - **Delete** - remove outfit (with confirmation)
6. Edit opens the outfit creator pre-filled with current items

---

## 9. IMAGE UPLOAD & PROCESSING

### Upload Flow
```
User selects image →
Frontend validates (type, size) →
Upload to Cloudinary →
Get back image URL →
Save URL to database
```

### Image Requirements
- **Accepted formats:** JPG, PNG, WEBP
- **Max file size:** 5MB
- **Recommended dimensions:** 800x800px to 1200x1200px
- **Auto-optimization:** Cloudinary handles compression

### Frontend Upload (with Cloudinary)
```javascript
// Using Cloudinary Upload Widget or manual upload
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');
  
  const response = await fetch(
    'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
    {
      method: 'POST',
      body: formData
    }
  );
  
  const data = await response.json();
  return data.secure_url; // This is your image URL
};
```

---

## 10. SECURITY & PRIVACY

### Security Measures
- ✅ HTTPS everywhere (enforced by hosting platforms)
- ✅ Password hashing (handled by Supabase)
- ✅ JWT tokens for authentication (Supabase)
- ✅ Row Level Security (RLS) in database
  - Users can only access their own clothing items
  - Users can only access their own outfits
- ✅ Input validation on frontend and backend
- ✅ CORS configuration (only allow your frontend domain)
- ✅ Rate limiting on API endpoints (prevent abuse)
- ✅ Image upload validation (file type, size)

### Database Security (Supabase RLS Policies)
```sql
-- ClothingItem policies
CREATE POLICY "Users can view own items"
ON clothing_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
ON clothing_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
ON clothing_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
ON clothing_items FOR DELETE
USING (auth.uid() = user_id);

-- Similar policies for outfits table
```

### Privacy Policy
**Data collected:**
- Email, username (for account)
- Uploaded clothing images
- Created outfits

**Data usage:**
- Provide wardrobe management service
- Improve app functionality
- No third-party sharing (except hosting services)

**User rights:**
- Export all data
- Delete account and all data
- Update profile information

---

## 11. PERFORMANCE REQUIREMENTS

### Expected Load (MVP)
- **Users:** 100-1,000 users
- **Clothing items per user:** 20-100 items
- **Outfits per user:** 5-20 outfits
- **API calls per day:** ~1,000-5,000

### Performance Targets
- ✅ Page load time: < 2 seconds
- ✅ Image load time: < 1 second (with lazy loading)
- ✅ API response time: < 500ms
- ✅ Database query time: < 100ms

### Optimization Strategies
1. **Images:**
   - Cloudinary auto-optimization
   - Lazy loading (only load images in viewport)
   - Thumbnail generation (small images for grids)
   - Progressive loading (blur placeholder → full image)

2. **Data Fetching:**
   - Pagination (load 20 items at a time)
   - Caching with React Query or SWR
   - Debounced search (wait 300ms after typing)

3. **Frontend:**
   - Code splitting (lazy load routes)
   - Minimize bundle size
   - Use production build for deployment

4. **Backend:**
   - Database indexing (userId, createdAt)
   - Connection pooling
   - Gzip compression for API responses

---

## 12. ERROR HANDLING

### Frontend Error States
- **Network errors:** "Unable to connect. Check your internet."
- **Upload errors:** "Upload failed. Try a smaller image."
- **Not found:** "Item not found. It may have been deleted."
- **Validation errors:** "Please fill in all required fields."
- **Generic errors:** "Something went wrong. Please try again."

### Backend Error Responses
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Item name is required",
    "field": "name"
  }
}
```

### Common Error Codes
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not your resource)
- `404` - Not Found
- `500` - Internal Server Error

---

## 13. DEVELOPMENT ROADMAP

### Phase 1: Setup & Foundation (Week 1)
- [ ] Set up GitHub repository
- [ ] Initialize React frontend with Vite + Tailwind
- [ ] Initialize Express backend
- [ ] Set up Supabase project (database + auth)
- [ ] Set up Cloudinary account
- [ ] Connect all services locally
- [ ] Create basic landing page
- [ ] Implement authentication (register, login, logout)

### Phase 2: Wardrobe Management (Week 2-3)
- [ ] Create clothing item database table
- [ ] Build "Add Item" form with image upload
- [ ] Implement POST /api/clothing endpoint
- [ ] Build wardrobe grid view
- [ ] Implement GET /api/clothing endpoint
- [ ] Add filtering by category
- [ ] Add search functionality
- [ ] Build item detail view
- [ ] Implement edit functionality (PUT endpoint)
- [ ] Implement delete functionality (DELETE endpoint)
- [ ] Add loading and error states

### Phase 3: Outfit Creation (Week 3-4)
- [ ] Create outfit database table
- [ ] Build manual outfit creator interface
- [ ] Implement item selection (click to add/remove)
- [ ] Add outfit name and notes inputs
- [ ] Implement POST /api/outfits endpoint
- [ ] Build "My Outfits" page
- [ ] Implement GET /api/outfits endpoint
- [ ] Build outfit detail view (with full item data)
- [ ] Implement outfit editing (PUT endpoint)
- [ ] Implement outfit deletion (DELETE endpoint)

### Phase 4: User Profile & Polish (Week 4-5)
- [ ] Build user profile page
- [ ] Implement profile picture upload
- [ ] Add wardrobe statistics (GET /api/user/stats)
- [ ] Create navigation bar (responsive)
- [ ] Add empty states for all pages
- [ ] Implement responsive design (mobile-first)
- [ ] Add loading skeletons
- [ ] Polish all UI components
- [ ] Add success/error toast notifications
- [ ] Improve color scheme and typography

### Phase 5: Testing & Deployment (Week 5-6)
- [ ] Test all user flows end-to-end
- [ ] Test with multiple user accounts
- [ ] Test on mobile devices
- [ ] Test edge cases (empty wardrobe, many items)
- [ ] Fix all bugs
- [ ] Optimize images and performance
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set up production environment variables
- [ ] Test production deployment
- [ ] Monitor for errors

### Phase 6: Documentation (Week 6)
- [ ] Write comprehensive README
- [ ] Add setup instructions
- [ ] Document API endpoints
- [ ] Add screenshots
- [ ] Write user guide
- [ ] Create demo video (optional)

---

## 14. ENVIRONMENT VARIABLES

### Frontend (.env)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend (.env)
```bash
PORT=3000
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 15. REPOSITORY STRUCTURE

```
fabriq/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── clothing/
│   │   │   │   ├── ClothingCard.jsx
│   │   │   │   ├── ClothingGrid.jsx
│   │   │   │   ├── AddItemForm.jsx
│   │   │   │   └── EditItemModal.jsx
│   │   │   ├── outfits/
│   │   │   │   ├── OutfitCard.jsx
│   │   │   │   ├── OutfitCreator.jsx
│   │   │   │   └── OutfitDetail.jsx
│   │   │   ├── shared/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── ImageUpload.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Wardrobe.jsx
│   │   │   ├── Outfits.jsx
│   │   │   ├── OutfitCreate.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useClothing.js
│   │   │   └── useOutfits.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── clothing.js
│   │   │   └── outfits.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── clothing.js
│   │   │   ├── outfits.js
│   │   │   └── user.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── controllers/
│   │   │   ├── clothingController.js
│   │   │   ├── outfitController.js
│   │   │   └── userController.js
│   │   ├── services/
│   │   │   ├── supabase.js
│   │   │   └── cloudinary.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 16. TESTING CHECKLIST

### Authentication
- [ ] User can register with email/password
- [ ] User receives validation errors for invalid inputs
- [ ] User can log in with correct credentials
- [ ] User cannot log in with wrong credentials
- [ ] User can log out
- [ ] Protected routes redirect to login when not authenticated

### Clothing Items
- [ ] User can add a clothing item with image
- [ ] Image upload validates file type and size
- [ ] User can view all their clothing items
- [ ] User can filter items by category
- [ ] User can search items by name
- [ ] User can edit clothing item details
- [ ] User can delete clothing item (with confirmation)
- [ ] User cannot access other users' items

### Outfits
- [ ] User can create outfit by selecting items
- [ ] User can name and save outfit
- [ ] User can view all saved outfits
- [ ] User can view outfit details with all items
- [ ] User can edit outfit (change items or name)
- [ ] User can delete outfit (with confirmation)
- [ ] Empty state shows when no outfits exist

### Profile
- [ ] User can view profile information
- [ ] User can see wardrobe statistics
- [ ] User can upload profile picture
- [ ] User can update username

### UI/UX
- [ ] All pages are responsive (mobile, tablet, desktop)
- [ ] Loading states show during async operations
- [ ] Error messages display clearly
- [ ] Success messages confirm actions
- [ ] Empty states guide users to take action
- [ ] Navigation works correctly on all pages

---

## 17. SUCCESS METRICS

### By End of MVP
1. ✅ Fully functional user authentication
2. ✅ Users can manage 20+ clothing items easily
3. ✅ Users can create and save 5+ outfits
4. ✅ App works smoothly on mobile and desktop
5. ✅ Page load times under 2 seconds
6. ✅ Zero critical bugs in production
7. ✅ Clean, intuitive user interface
8. ✅ Complete documentation in README

### Future Metrics (Post-MVP)
- User retention (% returning after 7 days)
- Average items per user
- Average outfits created per user
- Daily active users
- User feedback/satisfaction scores

---

## 18. KNOWN LIMITATIONS & FUTURE ENHANCEMENTS

### Current Limitations
- No AI-powered features (coming in v2)
- No social features (sharing, following)
- No outfit recommendations
- No calendar/planning features
- No mobile app (PWA only)

### Future v2 Features
- 🎨 AI outfit generation from inspiration images
- 🌤️ Weather-based outfit suggestions
- 📊 Advanced analytics (color distribution, wear frequency)
- 👥 Social features (share outfits, follow friends)
- 📅 Outfit calendar (plan outfits for the week)
- 🏷️ Smart tagging and categorization
- 🛍️ Shopping list (items you need)
- 📱 Native mobile app (React Native)

---

## 19. QUESTIONS & DECISIONS MADE

### Resolved
- ✅ **No ML/AI in MVP** - Adding in v2 after core features are solid
- ✅ **Database:** Supabase (PostgreSQL + Auth + Storage all-in-one)
- ✅ **Image hosting:** Cloudinary (better optimization than Supabase)
- ✅ **Deployment:** Vercel (frontend) + Railway (backend)
- ✅ **Styling:** Tailwind CSS (fast development, easy customization)

### To Decide Later
- ⏳ Exact AI model for outfit generation (GPT-4 Vision vs custom model)
- ⏳ Monetization strategy (freemium, premium features)
- ⏳ Social features scope
- ⏳ Mobile app development timeline

---

## 20. GETTING STARTED

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Supabase account (free)
- Cloudinary account (free)

### Quick Start Commands
```bash
# Clone repository
git clone https://github.com/yourusername/fabriq.git
cd fabriq

# Setup frontend
cd frontend
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev

# Setup backend (in new terminal)
cd backend
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev
```

### First Steps
1. Create Supabase project at https://supabase.com
2. Create Cloudinary account at https://cloudinary.com
3. Copy API keys to .env files
4. Run database migrations (Supabase SQL editor)
5. Start development servers
6. Open http://localhost:5173

---

## TIMELINE ESTIMATE

**Total MVP Development Time: 6 weeks**

- **Week 1:** Setup + Auth + Database foundations
- **Week 2:** Wardrobe management (add/edit/delete items)
- **Week 3:** Outfit creation and viewing
- **Week 4:** User profile + UI polish
- **Week 5:** Testing + bug fixes
- **Week 6:** Deployment + documentation

**Recommended schedule:** 15-20 hours/week

---

## SUPPORT & RESOURCES

### Documentation Links
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- Cloudinary: https://cloudinary.com/documentation
- Express: https://expressjs.com

### Learning Resources
- Supabase Auth tutorial
- React Router docs
- Tailwind CSS components (shadcn/ui, Headless UI)
- Image upload with Cloudinary tutorial

---

**Ready to build Fabriq! Start with Phase 1 and work through each feature methodically. Good luck! 🚀**
