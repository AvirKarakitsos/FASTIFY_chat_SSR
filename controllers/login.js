export function redirect(requset, reply) {
    return reply.redirect('/login');
}

export function index(request, reply) {
    return reply.view('view/login.html');
}

export async function login(fastify, request, reply) {
    const email = request.body.email;

    if (!email) throw new Error('Utilisateur introuvable');

    const [result, fields] = await fastify.mysql.query(
        'SELECT * FROM users WHERE email=?',
        [email],
    );

    if (!result[0]) throw new Error('Utilisateur introuvable');

    request.session.set('user', {
        id: result[0].id,
    });

    return reply.redirect('/dashboard');
}

export async function logout(fastify, request, reply) {
    const { id } = request.session.get('user');

    await fastify.mysql.query(
        'UPDATE users SET isConnected=false WHERE id = ?',
        [id],
    );

    request.session.delete();

    return reply.redirect('/login');
}
