# Trackora: Music Record Store Management System

Trackora is a full-stack, cloud-native Information System designed for managing a vinyl record store. It integrates a React-based frontend with a FastAPI backend, leveraging the Discogs API for real-world metadata and AWS for automated, scalable infrastructure.

## 🚀 Features

- **Dynamic Catalog**: Real-time record searching and metadata fetching via Discogs API.
- **E-commerce Flow**: Full shopping cart, wishlist functionality, and checkout process.
- **Admin Dashboard**: Specialized interface for administrators to import albums directly into the local database from Discogs.
- **3D Interactive UI**: Record cards feature a custom 3D perspective hover effect.
- **Secure Authentication**: JWT-based authentication with role-based access control.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic.
- **Database**: AWS RDS (MySQL).
- **Infrastructure**: Terraform (Infrastructure as Code).
- **DevOps**: GitHub Actions (CI/CD), Docker, Nginx.

## ☁️ Architecture & Deployment

The system is deployed on AWS using an automated pipeline:
- **Networking**: Custom VPC with public subnets for the API and private subnets for the database.
- **Frontend Hosting**: Static assets are hosted on **S3** and distributed via **CloudFront** for global low latency.
- **Backend API**: Hosted on an **EC2** instance within a Docker container, managed by an **Nginx** reverse proxy.
- **Container Registry**: Docker images are stored in **AWS ECR**.

## 📦 Getting Started

### Prerequisites
- Docker & Docker Compose
- AWS CLI (configured)
- Terraform

### Local Development
1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python migrate.py  # Initialize DB schema
   python seed.py     # Seed initial data from Discogs
   uvicorn main:app --reload

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev

3. **DevOps**:
   ```bash
   cd terraform
   terraform init
   terraform apply
   terraform destroy  # Destroy infrastructure when no longer needed.

4. **CI/CD**:
- **Backend**: Pushing to the main branch triggers a build/push to ECR and an SSH deployment to EC2.
- **Frontend**: Pushing to the main branch builds the React app, syncs it to S3, and invalidates the CloudFront cache.

## Disclaimer

This application uses Discogs’ API but is not affiliated with, sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink Media, LLC.