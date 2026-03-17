## 🚀 Node.js Installation Guide for Windows

### Easy Installation - Download from Official Website

**Step 1: Download Node.js**
1. Go to: https://nodejs.org/
2. Click the green "LTS" button (recommended for most users)
3. The installer will download (node-vXX.XX.X-x64.msi)

**Step 2: Run the Installer**
1. Double-click the downloaded `.msi` file
2. Click "Next" through all the prompts
3. Accept the default installation path (usually C:\Program Files\nodejs)
4. Complete the installation

**Step 3: Verify Installation**
1. Close all PowerShell/Command Prompt windows
2. Open a NEW PowerShell window
3. Run this command:
   ```
   node --version
   ```
4. You should see a version number like: v18.18.0

**Step 4: Install Dependencies**
1. Navigate to your project:
   ```
   cd "C:\Users\HP\Desktop\new code"
   ```
2. Run:
   ```
   npm install
   ```

**Step 5: Start the Server**
```
npm start
```

You should see:
```
✅ ShopHub Server is running on http://localhost:3000
```

### If Installation Still Fails:

**Option A: Direct Link**
Download directly from: https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi

**Option B: Alternative Setup**
Instead of using the backend, you can:
1. Skip the database for now
2. Use the website with localStorage only
3. Later connect to a cloud database (Firebase, MongoDB Atlas, etc.)

### Verification Commands (After Installation)
```
node --version
npm --version
```

Both should show version numbers.

---

**Once Node.js is installed, run in PowerShell:**
```
cd "C:\Users\HP\Desktop\new code"
npm install
npm start
```

Then open: http://localhost:3000
