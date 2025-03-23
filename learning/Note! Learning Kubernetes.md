# Note: Learning Kubernetes

Kubernetes 基礎教學（二）實作範例：Pod、Service、Deployment、Ingress

如何建立一個 Pod？什麼是 Service、Deployment、Ingress 以及如何實作它們？ Kubernetes（K8S）是一個可以幫助我們管理微服務（microservices）的系統，他可以自動化地部署及管理多台機器上的多個容器（Container）。簡單來說，他可以做到： 同時部署多個容器到多台機器上（Deployment） ...


### K8s 快速導覽（簡單易懂）

[Kubernetes k8s 十分钟快速入门](https://www.youtube.com/watch?v=ubz3cFgxeJA)

### 基本介紹

[Kubernetes 基礎教學（二）實作範例：Pod、Service、Deployment、Ingress](https://cwhu.medium.com/kubernetes-implement-ingress-deployment-tutorial-7431c5f96c3e)

[[Day 1] 前言 & 介紹Kubernetes - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天](https://ithelp.ithome.com.tw/articles/10192401)

### K8s 小常識

[K8s Road Map](https://www.notion.so/K8s-Road-Map-4b8447876c56492c902bb12cd0efe206?pvs=21)

[宏觀 K8s 運作（元件概述）](https://www.notion.so/K8s-e85c111d805f460eb46dcabd5e3a9230?pvs=21)

[Install kubectl](https://www.notion.so/Install-kubectl-59772531572346979fb4c1d94f54191b?pvs=21)

[kubectl 常見指令](https://www.notion.so/kubectl-9b4846e8a26048f4a851a7e4ccb5c004?pvs=21)

[API Groups & RBAC ](https://www.notion.so/API-Groups-RBAC-16868f823d0542ffa861980525185998?pvs=21)

[K8s 工具](https://www.notion.so/K8s-97fd9f3a0e0e4ebd8260892d76a9f4bc?pvs=21)

[K8s IP](https://www.notion.so/K8s-IP-3c85bd1d16ea408780d7aad14b5f9012?pvs=21)

[K8s Ports](https://www.notion.so/K8s-Ports-ae3203605c7c472692fc673121a60a5e?pvs=21)

[K8s 部署策略](https://www.notion.so/K8s-8097907eeccd40f7abeaec9e8f1ff178?pvs=21)

[K8s YAML 設定](https://www.notion.so/K8s-YAML-03fa9b8713f84e098df9baec930e6000?pvs=21)

[K8s 負載平衡](https://www.notion.so/K8s-fe5194aaa59c4b1c8f586468384fdea7?pvs=21)

### 實作筆記

[Minikube 簡介、安裝與指令](https://www.notion.so/Minikube-e611a61bb3304ed9bdf8abc289a63ae0?pvs=21)

[microk8s kubectl 常見指令](https://www.notion.so/microk8s-kubectl-662135e97e9f4b048ef28993a81abc78?pvs=21)

[K8s 建立 cluster - Kubeadm（失敗）](https://www.notion.so/K8s-cluster-Kubeadm-eac2a08517e44b4a96fe015988186e72?pvs=21)

[K8s 建立 cluster - KubeSpray（放棄）](https://www.notion.so/K8s-cluster-KubeSpray-41d22384c91e4888827ac34e60c120d8?pvs=21)

[K8s 建立 cluster - microk8s（成功）](https://www.notion.so/K8s-cluster-microk8s-493d1ba38ce443efb802e2f789dd82bf?pvs=21)

[K8s Replica Controller](https://www.notion.so/K8s-Replica-Controller-833de4b8acad492e971f00963be89d42?pvs=21)

[K8s Deployment ](https://www.notion.so/K8s-Deployment-5f99f4870d49484eab545f4da32edf47?pvs=21)

[K8s Deployment / StatefulSet / DaemonSet](https://www.notion.so/K8s-Deployment-StatefulSet-DaemonSet-11b5f412a4be469fab4bcbcb3413d841?pvs=21)

[K8s Service ](https://www.notion.so/K8s-Service-9b4d830b651c42e7a40c59adc70b9163?pvs=21)

[K8s Ingress](https://www.notion.so/K8s-Ingress-1f996862b41e4452b0faa74d6239049d?pvs=21)

[K8s Ingress Controller](https://www.notion.so/K8s-Ingress-Controller-76cfcffc300d40b98dbe6e5faf96cd4c?pvs=21)

[State Metrics 簡介與設置](https://www.notion.so/State-Metrics-ef9c5fb3d7b84a7aae812e07d4f26fb4?pvs=21)

[Prometheus 簡介與安裝](https://www.notion.so/Prometheus-5a9b4f721ed048b8ab262b0eceaafbc7?pvs=21)

[Grafana 簡介與設置](https://www.notion.so/Grafana-5593f0040a924814934da879de8ccadf?pvs=21)

[ArgoCD 簡介與安裝](https://www.notion.so/ArgoCD-26b48773b6fe41df87340226c0e3cda3?pvs=21)

[K8s Secret - 存放環境變數](https://www.notion.so/K8s-Secret-4de5f178e18b4b15b88feadb083f2347?pvs=21)

[K8s PV (Persistent Volumes)](https://www.notion.so/K8s-PV-Persistent-Volumes-ac063c3c5ca446fb987576f2fc601fd3?pvs=21)

[K3s 安裝](https://www.notion.so/K3s-ffc74d64b7f846c4963992d9e10f13db?pvs=21)

[K3s Dashboard](https://www.notion.so/K3s-Dashboard-e1f697e2c50049158a88844d855a6b3c?pvs=21)

[cAdvisor 搭配 prometheus 監控 cluster 外 container ](https://www.notion.so/cAdvisor-prometheus-cluster-container-c857c625f26c43949a2106393b360469?pvs=21)

[[踩雷] Kube Config 突然消失](https://www.notion.so/Kube-Config-616754134ea84d99864314023504d114?pvs=21)

### K8s 資料存放

[衡量 K8s Data Storage Solution 的標準](https://www.notion.so/K8s-Data-Storage-Solution-10e19b0479aa4d049c65ce398a6ee4fe?pvs=21)

[K8s 資料掛載 - hostpath](https://www.notion.so/K8s-hostpath-e2139e3eb9d74f8eb60bdfb1ab68e6b7?pvs=21)

[K8s 資料掛載 - NFS](https://www.notion.so/K8s-NFS-86ad0478e9194c31a4fb1da45ad75576?pvs=21)