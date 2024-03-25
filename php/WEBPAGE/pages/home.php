<?php
?>

<html>
<header>
    <title>ATC aquarium manager</title>
</header>
<main>
    <h1>Welcome to the ATC aquarium manager's website!</h1>
    <p>Here the admin (and only the admin) can manage the whole system (users, database, ATC-systems) etc.</p>
    <section>
        <form method='POST' action='/WEBPAGE/actions/login.php'>
            <label for='username'>
                <input name='username' type="text" placeholder='Username' />
            </label>
            <label for='password'>
                <input name='password' type="password" placeholder='Password' />
            </label>
            <button type='submit'>Log in</button>
        </form>
    </section>
</main>

</html>