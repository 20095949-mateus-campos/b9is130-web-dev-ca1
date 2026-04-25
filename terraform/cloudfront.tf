resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "s3-oac-b9is130-web-dev-ca1"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend_cdn" {
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "github_actions_secret" "cloudfront_id" {
  repository      = "b9is130-web-dev-ca1"
  secret_name     = "CLOUDFRONT_DISTRIBUTION_ID"
  value = aws_cloudfront_distribution.frontend_cdn.id
}

resource "github_actions_secret" "cloudfront_domain" {
  repository      = "b9is130-web-dev-ca1"
  secret_name     = "CLOUDFRONT_DOMAIN"
  value = "https://${aws_cloudfront_distribution.frontend_cdn.domain_name}"
}

output "cloudfront_id" {
  value = aws_cloudfront_distribution.frontend_cdn.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend_cdn.domain_name
}
