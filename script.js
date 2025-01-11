$(document).ready(function () {
    $('#toggle-mode').on('change', function () {
        $('body').toggleClass('dark-mode');
    });

    // Function to display the error alert
    function showErrorAlert(heading, message) {
        $('#error-heading').text(heading);
        $('#error-message').text(message);
        $('#error-alert').removeClass('d-none');  // Show the alert
        

        const errorAlertElement = document.getElementById('error-alert');
        if (errorAlertElement) {
            errorAlertElement.scrollIntoView({ behavior: 'smooth' });
           
        }
    }

    // Custom click handler for closing the alert
    $(document).on('click', '.btn-close', function () {
        $('#error-alert').addClass('d-none'); // Hide the alert without removing it
        $('#no-search-message').show();

    });

    function searchUsers() {
        let username = $('#username').val().trim();
        $('#no-search-message').hide();

        // Hide any existing alerts
        $('#error-alert').addClass('d-none');
        if (username) {
            if ($.fn.DataTable.isDataTable('#user-table')) {
                $('#user-table').DataTable().clear().destroy();
                $('#user-details').hide();
            }
            // Fetch GitHub users
            $.ajax({
                url: `https://api.github.com/search/users?q=${username}`,
                method: 'GET',
                success: function (data) {
                    let users = data.items;

                    if (users.length > 0) {
                        let tableBody = '';
                        users.forEach(function (user) {
                            tableBody += `
                                <tr>
                                    <td><img src="${user.avatar_url}" alt="${user.login}" class="user-avatar" data-login="${user.login}" style="cursor: pointer;"></td>
                                    <td>${user.login}</td>
                                </tr>
                            `;
                        });
                        $('#user-table tbody').html(tableBody);

                        $('#user-table').DataTable({
                            pageLength: 5,
                            lengthChange: false,
                            searching: false
                        });
                    } else {
                        // No users found
                        showErrorAlert('No Users Found!', 'Please try again or check your search criteria.');
                        
                        // $('#no-search-message').show();
                    }
                },
                error: function () {
                    // Failed to fetch users
                    showErrorAlert('Error!', 'Failed to fetch users. Please try again later.');
                    // $('#no-search-message').show();
                }
            });
        } else {
            // No username entered
            showErrorAlert('Input Error!', 'Please enter a GitHub username.');
            // $('#no-search-message').show();
        }
    }

    function fetchUserDetails(username) {
        $('#user-name').text('');
        $('#user-avatar').attr('src', '');
        $('#user-bio').text('');
        $('#user-followers').text('');
        $('#user-following').text('');
        $('#user-repos').text('');
        $('#user-join-date').text('');
        $('#user-website').attr('href', '#').text('');
        $('#user-location').text('');
        $('#user-company').text('');
        $('#user-twitter').text('');

        $('#user-details').hide();

        // Fetch user details
        $.ajax({
            url: `https://api.github.com/users/${username}`,
            method: 'GET',
            success: function (data) {
                $('#user-name').text(data.name || data.login);
                $('#user-avatar').attr('src', data.avatar_url);
                $('#user-bio').text(data.bio || 'This Profile has no bio');
                $('#user-followers').text(data.followers);
                $('#user-following').text(data.following);
                $('#user-repos').text(data.public_repos);
                $('#user-join-date').text(new Date(data.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }));

                $('#user-website').attr('href', data.html_url).text(data.html_url);
                $('#user-location').text(data.location || 'Not Available');
                $('#user-company').text(data.company || 'Not Available');
                $('#user-twitter').text(data.twitter_username || 'Not Available');

                $('#user-details').show();
            },
            error: function () {
                alert('User not found!');
                $('#user-details').hide();
            }
        });
    }

    $('#search-btn').on('click', function () {
        searchUsers();
    });

    $('#username').on('keydown', function (e) {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });

    $('#username').on('input', function () {
        if ($(this).val()) {
            $('.fa-circle-xmark').show();
        } else {
            $('.fa-circle-xmark').hide();
            $('#user-details').hide();
            $('#user-table_wrapper').hide();
            $('#no-search-message').show();

        }
    });

    $('.fa-circle-xmark').on('click', function () {
        $('#username').val('');
        $('#username').trigger('input');
        $('#user-details').hide();
        $('#user-table_wrapper').hide();


    });

    $(document).on('click', '.user-avatar', function () {
        let username = $(this).data('login');
        fetchUserDetails(username);
    });

    $('.fa-circle-xmark').hide();
});
