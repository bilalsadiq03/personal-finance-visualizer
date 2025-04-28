# Personal Finance Visualizer

A comprehensive web application for tracking, visualizing, and managing personal finances. Built with Next.js, React, and MongoDB.

## Features

### Transaction Management
- Add, edit, and delete financial transactions
- Categorize transactions for better organization
- View transaction history with sorting and filtering

### Category Management
- Create custom categories with color coding
- Organize transactions by category
- Visualize spending patterns by category

### Budget Management
- Set monthly budgets for each spending category
- Track spending against budgets
- Get insights on budget performance and overspending

### Dashboard & Analytics
- Monthly expense trends visualization
- Category breakdown with interactive pie chart
- Budget vs. actual spending comparison
- Recent transactions overview
- Financial summary cards with key metrics

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Charts**: Recharts for data visualization
- **Database**: MongoDB
- **Styling**: Tailwind CSS with dark/light mode support
- **Form Handling**: React Hook Form with Zod validation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bilalsadiq03/personal-finance-visualizer.git
   cd personal-finance-visualizer
   
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding Transactions
1. Navigate to the Transactions page
2. Click the "Add Transaction" button
3. Fill in the transaction details:
   - Amount
   - Description
   - Category
   - Date
   - Type (Income/Expense)
4. Click "Save" to add the transaction

### Managing Categories
1. Go to the Categories page
2. Click "Add Category" to create a new category
3. Set a name and color for the category
4. Use the category when adding transactions

### Setting Budgets
1. Visit the Budget page
2. Select a category
3. Set the monthly budget amount
4. The dashboard will show progress towards your budget

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


