FROM prom/prometheus:v2.52.0

COPY prometheus.yml /etc/prometheus/prometheus.yml

COPY alert_rules.yml /etc/prometheus/alert_rules.yml

WORKDIR /etc/prometheus

EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus"]