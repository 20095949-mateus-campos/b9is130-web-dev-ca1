resource "aws_db_instance" "mysql_db" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "record_store"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  publicly_accessible  = false

  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name

  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

resource "github_actions_secret" "db_host" {
  repository      = "b9is130-web-dev-ca1"
  secret_name     = "DB_HOST"
  value = aws_db_instance.mysql_db.address 


  lifecycle {
    prevent_destroy = true
  }
}

output "rds_endpoint" {
  value = aws_db_instance.mysql_db.endpoint
}

output "database_name" {
  value = aws_db_instance.mysql_db.db_name
}
