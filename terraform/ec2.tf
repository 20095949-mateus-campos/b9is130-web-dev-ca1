resource "aws_key_pair" "deployer" {
  key_name   = "record-store-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDIhHtaNpqnc/6KcYlwb8Bh+E0Q42Gj9B1mytebBEUaT 20095949@mydbsie"
}

resource "aws_instance" "api_server" {
  ami           = "ami-0324bce2436ce02b2"
  instance_type = "t3.micro"
  
  subnet_id     = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io awscli

              systemctl start docker
              systemctl enable docker

              usermod -aG docker ubuntu
              newgrp docker
              
              # docker pull my-docker-hub-username/record-store-backend:latest              
              # docker run -d -p 8000:8000 --env-file .env my-image-name
              EOF

  tags = {
    Name = "MusicStore-API-Server"
  }
}

output "api_server_ip" {
  value = aws_instance.api_server.public_ip
}
