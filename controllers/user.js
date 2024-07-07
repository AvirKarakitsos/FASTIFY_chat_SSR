export async function dashboard(fastify, request, reply) {
    try {
        const { id } = request.session.get('user');

        await fastify.mysql.query(
            'UPDATE users SET isConnected=true WHERE id = ?',
            [id],
        );

        const [user, userFields] = await fastify.mysql.query(
            'SELECT id, image, name FROM users WHERE id = ?',
            [id],
        );

        const [results, fields] = await fastify.mysql.query(
            'SELECT id, name, image, email, phone, isConnected FROM users WHERE id != ?',
            [id],
        );

        return reply.view('view/dashboard.ejs', {
            userAccount: user[0],
            users: results,
        });
    } catch (err) {
        console.error('message: ' + err);
    }
}
