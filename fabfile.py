from fabric.api import sudo, env, local, cd


env.hosts = [
    '34.195.172.210',
]
env.user = 'centos'
env.key_filename = '/Users/joefusaro/datasidekick-reactapp/datasidekick-reactapp.pem'


def deploy(
    user='datasidekick',
    path='/home/datasidekick/datasidekick-reactapp',
):
    sudo('systemctl stop nginx')

    with cd(path):
        sudo('whoami', user=user)
        sudo('git pull', user=user)
        sudo('npm install', user=user)
        sudo('chown -R {user}:{user} ./dist'.format(user=user))
        sudo('npm run prod', user=user)
        sudo('chown -R nginx:nginx ./dist')

    sudo('systemctl start nginx')

def ssh():
    local('ssh -i {key_filename} {user}@{host}'.format(
        user=env.user, key_filename=env.key_filename, host=env.hosts[0])
        )

def logs():
    sudo('tail -f /var/log/nginx/*')
