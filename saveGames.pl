#!C:/strawberry/perl/bin/perl.exe -w
use strict;
use warnings;
use Digest::MD5 qw(md5_hex);

use CGI ();
use CGI qw{ :standard };
use CGI::Carp qw{ fatalsToBrowser };
use JSON ();

print "Content-type: text/html\n\n";
my $cgi = CGI->new;

my $json = JSON->new->utf8->allow_nonref;
my $json_text = $cgi->param('main');
my $json_text2 = $cgi->param('admin');
my $json_pw = $cgi->param('password').'fsdfdsfdsvdsf534543hgdfgfdsdsfdsfffsdbd353gfd' ;

if (md5_hex($json_pw) != '4a4fa0aab52cfae19ea5fe921c90b4f3') {
	print "Failed to save games, wrong password.";
	exit 0;
}
my $dir = 'D:/temp';

opendir (DIR, $dir) or die $!;
my $num = 0;
my $filename = '';

while (my $file = readdir(DIR)) {
    # We only want files
    next unless (-f "$dir/$file");

    # Use a regular expression to find files ending in .txt
    next unless ($file =~ m/^data.games.(\d+).txt/);
	
	if ($1 > $num) {
		$num = $1;
	}
}

closedir(DIR);

$num += 1;

$filename = 'D:/temp/data.games.' . $num . '.txt';

open MYFILE, '>' , $filename;

print MYFILE $json_text;
close MYFILE;

$filename = 'D:/temp/data.games.admin.' . $num . '.txt';

open MYFILE, '>' , $filename;

print MYFILE $json_text2;
close MYFILE;

print "Games saved.";
