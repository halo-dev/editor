<template>
  <div id="app">
    <div class="item">
      <halo-editor
        ref="md"
        v-model="value"
        :autofocus="autofocus"
        :boxShadow="true"
        :scrollStyle="true"
        :shortCut="true"
        :subfield="subfield"
        :toolbarsFlag="toolbarsFlag"
        :transition="true"
        box-shadow-style="0 2px 12px 0 rgba(0, 0, 0, 0.1)"
        class="item-editor"
        preview-background="#fbfbfb"
        toolbars-background="#ffffff"
        @change="change"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        @previewtoggle="$previewtoggle"
        @subfieldtoggle="$subfieldtoggle"
      >
      </halo-editor>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      toolbars: {
        underline: true, // 下划线
        strikethrough: true, // 中划线
        alignCenter: true, // 中划线
        undo: true,
        save: true,
        fullscreen: true, // 全屏编辑
        navigation: true,
        preview: true,
        subfield: false
      },
      autofocus: true,
      subfield: true,
      toolbarsFlag: true,
      img_file: {},
      toolbar_settings: {
        undo: true, // 上一步
        redo: true, // 下一步
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        code: true, // code
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      imageClick: function (file) {
        console.log(file)
      },
      imgName: '',
      value: `## 依赖检查

目前运行 Halo 的最低依赖要求为 JRE 11，请务必确保在进行下面操作之前已经正确安装了 JRE。

目前介绍两种 Linux 发行版的安装方式，均为 OpenJRE，不推荐 Oracle 版本。

### CentOS <i class='mdi mdi-centos'></i>

\`\`\`bash
sudo yum install java-11-openjdk -y
\`\`\`

检查版本：

\`\`\`bash
java -version
\`\`\`

如果输出以下类似内容即代表成功

\`\`\`bash
openjdk version "11.0.10" 2021-01-19 LTS
OpenJDK Runtime Environment 18.9 (build 11.0.10+9-LTS)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.10+9-LTS, mixed mode, sharing)
\`\`\`

### Ubuntu <i class='mdi mdi-ubuntu'></i>

\`\`\`bash
sudo apt-get install openjdk-11-jre -y
\`\`\`

检查版本：

\`\`\`bash
java -version
\`\`\`

如果输出以下类似内容即代表成功

\`\`\`bash
openjdk version "11.0.10" 2021-01-19
OpenJDK Runtime Environment (build 11.0.10+9-Ubuntu-0ubuntu1.20.04)
OpenJDK 64-Bit Server VM (build 11.0.10+9-Ubuntu-0ubuntu1.20.04, mixed mode)
\`\`\`

## 安装

1. 创建新的系统用户

:::info
我们不推荐直接使用系统 root 用户来运行 Halo。如果您需要直接使用 root 用户，请跳过这一步。
:::

创建一个名为 halo 的用户（名字可以随意）

\`\`\`bash
useradd -m halo
\`\`\`

给予 sudo 权限

\`\`\`bash
usermod -aG wheel halo
\`\`\`

为 halo 用户创建密码

\`\`\`bash
passwd halo
\`\`\`

登录到 halo 账户

\`\`\`bash
su - halo
\`\`\`

2. 创建存放 [运行包](/getting-started/prepare#运行包) 的目录，这里以 \`~/app\` 为例

\`\`\`bash
mkdir ~/app && cd ~/app
\`\`\`

3. 下载运行包

\`\`\`bash
wget https://dl.halo.run/release/halo-1.4.17.jar -O halo.jar
\`\`\`

:::info
如果下载速度不理想，可以 [在这里](/getting-started/downloads) 选择其他下载地址。
:::

4. 创建 [工作目录](/getting-started/prepare#工作目录)

\`\`\`bash
mkdir ~/.halo && cd ~/.halo
\`\`\`

5. 下载示例配置文件到 [工作目录](/getting-started/prepare#工作目录)

\`\`\`bash
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
\`\`\`

6. 编辑配置文件，配置数据库或者端口等，如需配置请参考 [参考配置](/getting-started/config)

\`\`\`bash
vim application.yaml
\`\`\`

7. 测试运行 Halo

\`\`\`bash
cd ~/app && java -jar halo.jar
\`\`\`

8. 如看到类似以下日志输出，则代表启动成功。

\`\`\`bash
run.halo.app.listener.StartedListener    : Halo started at         http://127.0.0.1:8090
run.halo.app.listener.StartedListener    : Halo admin started at   http://127.0.0.1:8090/admin
run.halo.app.listener.StartedListener    : Halo has started successfully!
\`\`\`

打开 \`http://ip: 端口号\` 即可看到安装引导界面。

:::info
如测试启动正常，请继续看\`作为服务运行\`部分，第 8 步仅仅作为测试。当你关闭 ssh 连接之后，服务会停止。你可使用 <kbd>CTRL</kbd>+<kbd>C</kbd> 停止运行测试进程。
:::

:::tip
如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 \`http://ip: 端口号\` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
:::

## 作为服务运行

1. 退出 halo 账户，登录到 root 账户

> 如果当前就是 root 账户，请略过此步骤。

\`\`\`bash
exit
\`\`\`

2. 下载 Halo 官方的 halo.service 模板

\`\`\`bash
wget https://dl.halo.run/config/halo.service -O /etc/systemd/system/halo.service
\`\`\`

3. 修改 halo.service

\`\`\`bash
vim /etc/systemd/system/halo.service
\`\`\`

4. 修改配置

- **YOUR_JAR_PATH**：Halo 运行包的绝对路径，例如 \`/home/halo/app/halo.jar\`，注意：此路径不支持 \`~\` 符号。
- **USER**：运行 Halo 的系统用户，如果有按照上方教程创建新的用户来运行 Halo，修改为你创建的用户名称即可。反之请删除 \`User=USER\`。

\`\`\`ini
[Unit]
Description=Halo Service
Documentation=https://halo.run
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=USER
ExecStart=/usr/bin/java -server -Xms256m -Xmx256m -jar YOUR_JAR_PATH
ExecStop=/bin/kill -s QUIT $MAINPID
Restart=always
StandOutput=syslog

StandError=inherit

[Install]
WantedBy=multi-user.target
\`\`\`

:::tip
请确保 \`/usr/bin/java\` 是正确无误的。建议将 \`ExecStart\` 中的命令复制出来运行一下，保证命令有效。
:::

5. 重新加载 systemd

\`\`\`bash
systemctl daemon-reload
\`\`\`

6. 运行服务

\`\`\`bash
systemctl start halo
\`\`\`

7. 在系统启动时启动服务

\`\`\`bash
systemctl enable halo
\`\`\`

您可以查看服务日志检查启动状态

\`\`\`bash
journalctl -n 20 -u halo
\`\`\`

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其基本操作有一定了解。如果你对 Nginx 不熟悉，我们推荐使用 [OneinStack](/getting-started/install/other/oneinstack) 来管理 Nginx。

### Nginx

\`\`\`nginx
upstream halo {
  server 127.0.0.1:8090;
}
server {
  listen 80;
  listen [::]:80;
  server_name www.yourdomain.com;
  client_max_body_size 1024m;
  location / {
    proxy_pass http://halo;
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
\`\`\`

注意：Nginx 默认的 \`client_max_body_size\` 配置大小为 1m，可能会导致你在 Halo 后台上传文件被 Nginx 限制，所以此示例配置文件加上了 \`client_max_body_size 1024m;\` 这行配置。当然，1024m 可根据你的需要自行修改。

### Caddy 1.x

\`\`\`txt
https://www.yourdomain.com {
 gzip
 tls your@email.com
 proxy / localhost:8090 {
  transparent
 }
}
\`\`\`

### Caddy 2.x

\`\`\`txt
www.yourdomain.com

encode gzip

reverse_proxy 127.0.0.1:8090
\`\`\`

以上配置都可以在 <https://github.com/halo-dev/halo-common> 找到。
`
    }
  },
  methods: {
    $click(val) {
      console.log(val)
    },
    $imgAdd(pos, $file) {
      console.log('imgAdd', pos, $file)
      this.img_file[pos] = $file
    },
    $imgDel(pos) {
      console.log('imgDel', pos)
      delete this.img_file[pos]
    },
    change(val) {
      console.log(val)
    },
    $subfieldtoggle(flag) {
      console.log('sufield toggle' + flag)
    },
    $previewtoggle(flag) {
      console.log('preview toggle' + flag)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
body {
  margin: 0;
  padding: 0;
  padding-bottom: 50px;
}

.page-lang {
  position: absolute;
  top: 15px;
  right: 2%;
}

.page-header {
  box-sizing: border-box;
  padding: 90px 15px;
  width: 100%;
  height: 380px;
  color: #fff;
  text-align: center;
  background-color: #159957;
  background-image: linear-gradient(120deg, #155799, #159957);

  @media only screen and (max-width: 958px) {
    height: 300px;
    padding: 60px 15px;
  }

  @media only screen and (max-width: 768px) {
    height: 370px;
    padding: 50px 15px;
  }

  .project-name {
    margin-top: 0;
    margin-bottom: 0.1rem;
    font-size: 2.25rem;

    @media only screen and (max-width: 768px) {
      font-size: 25px;
    }
  }

  .project-tagline {
    margin-bottom: 2rem;
    font-weight: normal;
    opacity: 0.7;

    @media only screen and (max-width: 768px) {
      font-size: 16px;
    }
  }

  .btn {
    padding: 0.6rem 0.9rem;
    font-size: 0.9rem;
    display: inline-block;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.3rem;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    text-decoration: none;
    margin-left: 20px;
    box-sizing: border-box;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    @media only screen and (max-width: 768px) {
      display: block;
      width: 90%;
      padding: 0.75rem;
      font-size: 0.9rem;
      margin-left: 5%;
    }
  }
}

.item {
  width: 75%;
  margin-left: 12.5%;

  @media only screen and (max-width: 1100px) {
    width: 85%;
    margin-left: 7.5%;
  }

  @media only screen and (max-width: 768px) {
    width: 92%;
    margin-left: 4%;
  }

  .item-header {
    margin-top: 3.5rem;
    margin-bottom: 2rem;
    font-weight: normal;
    color: #159957;

    @media only screen and (max-width: 768px) {
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }

  .item-button {
    margin-bottom: 4rem;
  }

  .item-editor {
    width: 100%;
    height: 900px;
  }
}
</style>
