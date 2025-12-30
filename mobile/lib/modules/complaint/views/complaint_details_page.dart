// complaint_details_page.dart
import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/utils/extensions.dart';
import 'package:complaint/data/models/complaint_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../controllers/complaint_controller.dart';
import '../../../core/widgets/loading_widget.dart';

class ComplaintDetailsPage extends StatefulWidget {
  @override
  _ComplaintDetailsPageState createState() => _ComplaintDetailsPageState();
}

class _ComplaintDetailsPageState extends State<ComplaintDetailsPage> {
  final ComplaintController controller = Get.find<ComplaintController>();
  final ScrollController _scrollController = ScrollController();
  bool _showAppBarTitle = false;
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance?.addPostFrameCallback((_) {
      _loadComplaint();
    });
    
    // Listen to scroll to show/hide app bar title
    _scrollController.addListener(() {
      if (_scrollController.offset > 100 && !_showAppBarTitle) {
        setState(() => _showAppBarTitle = true);
      } else if (_scrollController.offset <= 100 && _showAppBarTitle) {
        setState(() => _showAppBarTitle = false);
      }
    });
  }
  
  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
  
  void _loadComplaint() {
    final arguments = Get.arguments;
    print('=== LOADING COMPLAINT ===');
    print('Arguments type: ${arguments.runtimeType}');
    print('Arguments value: $arguments');
    
    if (arguments is Map<String, dynamic>) {
      print('Arguments is Map (JSON)');
      try {
        final complaint = Complaint.fromJson(arguments);
        print('Successfully parsed complaint from JSON: ${complaint.id}');
        controller.loadComplaint(complaint);
      } catch (e) {
        print('Error parsing complaint from JSON: $e');
      }
    } else if (arguments is String) {
      print('Arguments is String ID: $arguments');
      controller.fetchComplaintDetails(arguments);
    } else {
      print('Arguments type not recognized: ${arguments.runtimeType}');
      
      // Get complaint ID from route parameters
      final parameters = Get.parameters;
      if (parameters.containsKey('id')) {
        print('Found ID in parameters: ${parameters['id']}');
        controller.fetchComplaintDetails(parameters['id']!);
      } else {
        print('No complaint data found in arguments or parameters');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Obx(() {
        if (controller.isLoading.value) {
          return LoadingWidget(message: 'Loading complaint details...');
        }
        
        final complaint = controller.complaint.value;
        if (complaint == null) {
          return _buildNotFoundState();
        }
        
        return _buildComplaintDetails(complaint);
      }),
    );
  }
  
  Widget _buildNotFoundState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off_rounded,
            size: 100,
            color: AppColors.textSecondary.withOpacity(0.5),
          ).animate().scale(duration: 500.ms),
          SizedBox(height: 24),
          Text(
            'Complaint Not Found',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ).animate().fadeIn(duration: 300.ms),
          SizedBox(height: 12),
          Text(
            'The complaint you\'re looking for doesn\'t exist or has been removed',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 32),
          ElevatedButton(
            onPressed: () => Get.back(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 2,
            ),
            child: Text(
              'Go Back',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ).animate().slideY(begin: 0.5, duration: 500.ms),
        ],
      ),
    );
  }
  
  Widget _buildComplaintDetails(Complaint complaint) {
    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        // App Bar with Hero-like effect
        SliverAppBar(
          expandedHeight: 200,
          floating: false,
          pinned: true,
          backgroundColor: AppColors.background,
          leading: IconButton(
            icon: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                Icons.arrow_back_rounded,
                color: AppColors.textPrimary,
                size: 20,
              ),
            ),
            onPressed: () => Get.back(),
          ),
          flexibleSpace: FlexibleSpaceBar(
            centerTitle: true,
            title: _showAppBarTitle 
                ? Text(
                    'Complaint Details',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ).animate().fadeIn()
                : null,
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.primary.withOpacity(0.1),
                    AppColors.background,
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: -50,
                    top: -50,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.primary.withOpacity(0.05),
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomLeft,
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'REFERENCE',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                              letterSpacing: 1.5,
                            ),
                          ).animate().fadeIn(delay: 100.ms),
                          SizedBox(height: 4),
                          Text(
                            complaint.referenceNumber,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ).animate().fadeIn(delay: 200.ms),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        
        // Main Content
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Badge
                _buildStatusBadge(complaint.status).animate().slideX(
                  begin: -0.5,
                  duration: 500.ms,
                  curve: Curves.easeOut,
                ),
                
                SizedBox(height: 24),
                
                // Title with Icon
                Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.description_rounded,
                        color: AppColors.primary,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        complaint.title,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 300.ms),
                
                SizedBox(height: 32),
                
                // Quick Info Cards
                _buildQuickInfoCards(complaint).animate().slideY(
                  begin: 0.5,
                  duration: 500.ms,
                  delay: 400.ms,
                  curve: Curves.easeOut,
                ),
                
                SizedBox(height: 32),
                
                // Description Card
                _buildDescriptionCard(complaint).animate().fadeIn(delay: 500.ms),
                
                SizedBox(height: 32),
                
                // Location Card
                _buildLocationCard(complaint).animate().fadeIn(delay: 600.ms),
                
                SizedBox(height: 32),
                
                // Dates Card
                _buildDatesCard(complaint).animate().fadeIn(delay: 700.ms),
                
                SizedBox(height: 32),
                
                // Additional Info Card
                _buildAdditionalInfoCard(complaint).animate().fadeIn(delay: 800.ms),
                
                SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildStatusBadge(String status) {
    final statusConfig = _getStatusConfig(status);
    
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: statusConfig.color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: statusConfig.color.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            statusConfig.icon,
            color: statusConfig.color,
            size: 16,
          ),
          SizedBox(width: 8),
          Text(
            statusConfig.label,
            style: TextStyle(
              color: statusConfig.color,
              fontWeight: FontWeight.w600,
              fontSize: 14,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildQuickInfoCards(Complaint complaint) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Category
            _buildInfoRow(
              icon: Icons.category_rounded,
              iconColor: AppColors.primary,
              label: 'Category',
              value: complaint.category,
            ),
            Divider(height: 24, color: AppColors.border),
            // Priority
            _buildInfoRow(
              icon: Icons.priority_high_rounded,
              iconColor: _getPriorityColor(complaint.priority),
              label: 'Priority',
              value: complaint.priority.toUpperCase(),
            ),
            Divider(height: 24, color: AppColors.border),
            // Complaint ID
            _buildInfoRow(
              icon: Icons.numbers_rounded,
              iconColor: AppColors.textSecondary,
              label: 'Complaint ID',
              value: complaint.id,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDescriptionCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.subject_rounded,
                  color: AppColors.primary,
                  size: 20,
                ),
                SizedBox(width: 12),
                Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Text(
              complaint.description.replaceAll('\\n', '\n'),
              style: TextStyle(
                fontSize: 16,
                color: AppColors.textSecondary,
                height: 1.6,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildLocationCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.location_on_rounded,
                  color: Colors.redAccent,
                  size: 20,
                ),
                SizedBox(width: 12),
                Text(
                  'Location',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(
                    complaint.location,
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.map_rounded,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDatesCard(Complaint complaint) {
    final dateFormat = DateFormat('MMM dd, yyyy - hh:mm a');
    
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.calendar_today_rounded,
                  color: Colors.blueAccent,
                  size: 20,
                ),
                SizedBox(width: 12),
                Text(
                  'Timeline',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            _buildTimelineItem(
              icon: Icons.add_circle_rounded,
              iconColor: AppColors.success,
              title: 'Created',
              date: dateFormat.format(complaint.createdAt),
            ),
            SizedBox(height: 16),
            if (complaint.updatedAt != null)
              _buildTimelineItem(
                icon: Icons.update_rounded,
                iconColor: AppColors.warning,
                title: 'Last Updated',
                date: dateFormat.format(complaint.updatedAt!),
              ),
            if (complaint.completedAt != null) SizedBox(height: 16),
            if (complaint.completedAt != null)
              _buildTimelineItem(
                icon: Icons.check_circle_rounded,
                iconColor: AppColors.success,
                title: 'Completed',
                date: dateFormat.format(complaint.completedAt!),
              ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAdditionalInfoCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Additional Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 20),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _buildInfoChip(
                  icon: Icons.person_outline_rounded,
                  label: 'Citizen ID',
                  value: complaint.citizenId.toString(),
                ),
                _buildInfoChip(
                  icon: Icons.business_rounded,
                  label: 'Entity ID',
                  value: complaint.entityId.toString(),
                ),
                _buildInfoChip(
                  icon: Icons.type_specimen_rounded,
                  label: 'Type ID',
                  value: complaint.complaintType.toString(),
                ),
                if (complaint.locked)
                  _buildInfoChip(
                    icon: Icons.lock_rounded,
                    label: 'Status',
                    value: 'Locked',
                    valueColor: AppColors.error,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildInfoRow({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 4),
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildTimelineItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String date,
  }) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 4),
              Text(
                date,
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildInfoChip({
    required IconData icon,
    required String label,
    required String value,
    Color valueColor = AppColors.textPrimary,
  }) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: valueColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  // Helper methods for status and priority
  StatusConfig _getStatusConfig(String status) {
    switch (status) {
      case 'resolved':
        return StatusConfig(
          label: 'Resolved',
          color: AppColors.success,
          icon: Icons.check_circle_rounded,
        );
      case 'in_progress':
        return StatusConfig(
          label: 'In Progress',
          color: AppColors.warning,
          icon: Icons.autorenew_rounded,
        );
      case 'rejected':
        return StatusConfig(
          label: 'Rejected',
          color: AppColors.error,
          icon: Icons.cancel_rounded,
        );
      case 'new':
      default:
        return StatusConfig(
          label: 'New',
          color: Colors.blue,
          icon: Icons.fiber_new_rounded,
        );
    }
  }
  
  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return AppColors.error;
      case 'medium':
        return AppColors.warning;
      case 'low':
        return AppColors.success;
      default:
        return AppColors.textSecondary;
    }
  }
}

class StatusConfig {
  final String label;
  final Color color;
  final IconData icon;
  
  StatusConfig({
    required this.label,
    required this.color,
    required this.icon,
  });
}