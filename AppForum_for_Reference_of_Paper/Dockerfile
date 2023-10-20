FROM node:19.8.1

RUN apt update
RUN apt upgrade -y
RUN apt install -y vim tar gzip unzip wget curl git
RUN apt install -y sqlite3

# Set up a non-root user
RUN useradd ufmg
RUN mkdir /home/ufmg
RUN mkdir /app
RUN npm i -g typescript ts-node tsc-watch

COPY . /app/
WORKDIR /app/front-end
RUN npm i && npm run prod
WORKDIR /app/back-end
RUN npm i

RUN chown -R ufmg:ufmg /home/ufmg
RUN chown -R ufmg:ufmg /app

#RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

COPY ./start.sh /start.sh
RUN chmod 744 /start.sh
RUN chown -R ufmg:ufmg /start.sh

WORKDIR /app
USER ufmg

EXPOSE 8080

CMD ["/start.sh"]

