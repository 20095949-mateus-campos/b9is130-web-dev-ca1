resource "aws_s3_bucket" "frontend" {
  bucket = "b9is130-record-store-api-frontend"
}

resource "aws_s3_bucket_public_access_block" "frontend_bpa" {
  bucket = aws_s3_bucket.frontend.id

#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "frontend_site" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# resource "aws_s3_bucket_policy" "allow_public_access" {
#   bucket = aws_s3_bucket.frontend.id
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid       = "PublicReadGetter"
#         Effect    = "Allow"
#         Principal = "*"
#         Action    = "s3:GetObject"
#         Resource  = "${aws_s3_bucket.frontend.arn}/*"
#       },
#     ]
#   })
  
#   depends_on = [aws_s3_bucket_public_access_block.frontend_bpa]
# }

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend_bpa]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend_cdn.arn
          }
        }
      }
    ]
  })
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.id
}

output "frontend_website_url" {
  value = aws_s3_bucket_website_configuration.frontend_site.website_endpoint
}
