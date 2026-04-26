resource "aws_key_pair" "deployer" {
  key_name   = "record-store-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDIhHtaNpqnc/6KcYlwb8Bh+E0Q42Gj9B1mytebBEUaT 20095949@mydbsie"
}

resource "aws_instance" "api_server" {
  ami           = "ami-0324bce2436ce02b2"
  instance_type = "t3.micro"
  
  subnet_id              = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.deployer.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y nginx certbot python3-certbot-nginx docker.io unzip

              curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
              unzip awscliv2.zip
              sudo ./aws/install

              sudo systemctl start nginx
              sudo systemctl enable nginx
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu

              mkdir -p /home/ubuntu/duckdns
              cat << 'DUCKSCRIPT' > /home/ubuntu/duckdns/duck.sh
              #!/bin/bash
              DOMAIN="${var.duckdns_domain}"
              TOKEN="${var.duckdns_token}"
              IP_FILE="/home/ubuntu/duckdns/last_ip.txt"

              CURRENT_IP=$(curl -s https://checkip.amazonaws.com)

              if [ -f "$IP_FILE" ]; then
                  LAST_IP=$(cat "$IP_FILE")
              else
                  LAST_IP=""
              fi

              if [ "$CURRENT_IP" != "$LAST_IP" ]; then
                  RESPONSE=$(curl -s "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip=$CURRENT_IP")
                  if [ "$RESPONSE" == "OK" ]; then
                      echo "$CURRENT_IP" > "$IP_FILE"
                  fi
              fi
              DUCKSCRIPT

              chmod +x /home/ubuntu/duckdns/duck.sh
              chown -R ubuntu:ubuntu /home/ubuntu/duckdns

              (crontab -u ubuntu -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/duckdns/duck.sh") | crontab -u ubuntu -
              
              sudo -u ubuntu /home/ubuntu/duckdns/duck.sh
              EOF

  tags = {
    Name = "MusicStore-API-Server"
  }
}

resource "github_actions_secret" "ec2_host" {
  repository      = "b9is130-web-dev-ca1"
  secret_name     = "EC2_HOST"
  value = aws_instance.api_server.public_ip


  lifecycle {
    prevent_destroy = true
  }
}

output "api_server_ip" {
  value = aws_instance.api_server.public_ip
}
