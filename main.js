import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const url = 'https://uucqqjkknlytpqxhhtwd.supabase.co';
const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y3Fxamtrbmx5dHBxeGhodHdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MzkzNzYwMSwiZXhwIjoyMDA5NTEzNjAxfQ.lwWdYJodSukSAqSrTvSzI_Ilpe4Un75JsFS-r9-YCWA';

// Create a single supabase client for interacting with your database
const supabase = createClient(url, key);

const RegisterForm = qs('#register-form');
const LoginForm = qs('#login-form');
const PostForm = qs('#post-form');

LoginForm.addEventListener('submit', login);
RegisterForm.addEventListener('submit', register);
PostForm.addEventListener('submit', addPost);

async function register(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  console.log(formData.email);
  console.log(formData.password);
  console.log(formData);

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        username: formData.username,
      },
    },
  });
  console.log(data);
}

async function login(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  console.log(formData.email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    console.log(error);
    console.log('böyle bir kullanıcı yok');
  } else {
    console.log(data);
    console.log('hosgeldiniz');
  }
}

async function isAuth() {
  const { data, error } = await supabase.auth.getSession();
  if (!error && data.session !== null) {
    console.log(data.session.user);
    return data.session.user;
  }
}

async function addPost(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));

  const user = await isAuth();
  console.log(user);

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        post: formData.post,
        user_id: user.id,
        user_mail: user.email,
        username: user.user_metadata.username,
      },
    ])
    .select();

  console.log(data);
}
