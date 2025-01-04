# 1️⃣ Use an official Node.js image
FROM node:20-alpine

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json (if available)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of your app's files to the container
COPY . .

# 6️⃣ Pass the Pexels API key as a build argument
ARG VITE_PEXELS_ACCESS_KEY

# 7️⃣ Set the environment variable for the build process
ENV VITE_PEXELS_ACCESS_KEY=${VITE_PEXELS_ACCESS_KEY}

# 6️⃣ Expose port 5173
EXPOSE 5173

# 7️⃣ Command to serve the app
CMD ["npm", "run", "dev"]
