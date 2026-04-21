variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "eu-west-1"
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

data "http" "my_public_ip" {
  url = "https://icanhazip.com/"
}

locals {
  current_ip = "${chomp(data.http.my_public_ip.response_body)}/32"
}
