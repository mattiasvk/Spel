#!C:/strawberry/perl/bin/perl.exe -w
use strict;
use warnings;


use CGI ();
use CGI qw{ :standard };
use CGI::Carp qw{ fatalsToBrowser };
use JSON ();

print header('application/json');

my $dir = 'D:/temp';

opendir (DIR, $dir) or die $!;
my $num = 0;
my $filename = '';

while (my $file = readdir(DIR)) {
    # We only want files
    next unless (-f "$dir/$file");

    # Use a regular expression to find files ending in .txt
    next unless ($file =~ m/^data.games.admin.(\d+).txt/);
	
	if ($1 > $num) {
		$num = $1;
		$filename = 'D:/temp/' . $file;
	}
}

closedir(DIR);

open MYFILE, '<',$filename;

while (<MYFILE>) { print $_; }

close MYFILE;

