import {configure} from './wordpress-env.mjs';
try {
 const index=process.argv.indexOf('--url');
 const url=index>=0?process.argv[index+1]:undefined;
 if(!url)throw Error('Use: npm run configure -- --url "http://localhost/aaai-portal-v1/wordpress/wp-json"');
 const result=configure(process.cwd(),url);
 if(result.status==='manual')throw Error(result.message);
 console.log(result.status==='preserved'?'Configuracao WordPress existente preservada.':'WORDPRESS_API_URL guardado no .env.local. Reinicie o frontend.');
} catch(error){console.error(error.message);process.exitCode=1;}
